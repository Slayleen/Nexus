"""
Backend integration tests for Project Nexus.
Covers: auth (register/login/me/logout), profile, students, endorsements, match,
projects (CRUD + join), opportunities, messages, forum, dashboard.

Uses REACT_APP_BACKEND_URL (public) so we exercise the deployed ingress + cookies.
"""

import os
import uuid
import time
import pytest
import requests
from dotenv import load_dotenv

# Load the frontend .env to get the public backend URL used by the browser.
load_dotenv("/app/frontend/.env")

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

SEEDED_EMAIL = "alice@lincolnhs.edu"
SEEDED_PASSWORD = "password123"


# ---------- fixtures ----------

@pytest.fixture(scope="session")
def alice_session():
    """Logged-in session for the seeded student Alice (uses httpOnly cookies)."""
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": SEEDED_EMAIL, "password": SEEDED_PASSWORD}, timeout=30)
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    assert "access_token" in s.cookies, "access_token cookie not set on login"
    return s


@pytest.fixture(scope="session")
def bob_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": "bob@westfield.edu", "password": "password123"}, timeout=30)
    assert r.status_code == 200, f"bob login failed: {r.text}"
    return s


@pytest.fixture(scope="session")
def alice_user(alice_session):
    r = alice_session.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 200
    return r.json()


@pytest.fixture(scope="session")
def bob_user(bob_session):
    r = bob_session.get(f"{API}/auth/me", timeout=15)
    return r.json()


# ---------- auth ----------

class TestAuth:
    def test_unauth_me_returns_401(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_login_seeded_alice(self):
        s = requests.Session()
        r = s.post(f"{API}/auth/login", json={"email": SEEDED_EMAIL, "password": SEEDED_PASSWORD}, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == SEEDED_EMAIL
        assert data["name"] == "Alice Chen"
        assert data.get("verified") is True
        assert "password_hash" not in data
        assert "_id" not in data
        assert isinstance(data.get("id"), str)
        # httpOnly cookie set
        assert "access_token" in s.cookies

    def test_login_invalid_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": SEEDED_EMAIL, "password": "wrong-pw"}, timeout=15)
        assert r.status_code == 401

    def test_register_new_edu_user_auto_verified(self):
        s = requests.Session()
        email = f"test_{uuid.uuid4().hex[:10]}@lincolnhs.edu"
        r = s.post(f"{API}/auth/register", json={
            "name": "TEST New Student", "email": email, "password": "password123",
            "school": "Lincoln High", "grade": "10th",
        }, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["email"] == email
        assert data["verified"] is True  # .edu auto-verified
        assert "access_token" in s.cookies
        # /me works with the cookie
        me = s.get(f"{API}/auth/me", timeout=15)
        assert me.status_code == 200
        assert me.json()["email"] == email

    def test_register_duplicate_email(self):
        r = requests.post(f"{API}/auth/register", json={
            "name": "Dup", "email": SEEDED_EMAIL, "password": "password123",
        }, timeout=15)
        assert r.status_code == 400

    def test_logout_clears_cookie(self):
        s = requests.Session()
        s.post(f"{API}/auth/login", json={"email": SEEDED_EMAIL, "password": SEEDED_PASSWORD}, timeout=15)
        assert "access_token" in s.cookies
        r = s.post(f"{API}/auth/logout", timeout=15)
        assert r.status_code == 200
        # Session cookie should be removed / /auth/me should fail
        me = s.get(f"{API}/auth/me", timeout=15)
        assert me.status_code == 401


# ---------- profile ----------

class TestProfile:
    def test_update_profile_persists(self, alice_session):
        payload = {
            "bio": "TEST_bio " + uuid.uuid4().hex[:6],
            "skills": ["Python", "TensorFlow", "TEST_skill"],
            "interests": ["AI", "Healthcare"],
            "looking_for": ["Hackathon team"],
        }
        r = alice_session.put(f"{API}/profile", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["bio"] == payload["bio"]
        assert "TEST_skill" in data["skills"]

        # Re-fetch via /auth/me to verify persistence
        me = alice_session.get(f"{API}/auth/me", timeout=15).json()
        assert me["bio"] == payload["bio"]
        assert "TEST_skill" in me["skills"]


# ---------- students / endorse ----------

class TestStudents:
    def test_list_students_excludes_self(self, alice_session, alice_user):
        r = alice_session.get(f"{API}/students", timeout=15)
        assert r.status_code == 200
        students = r.json()
        assert isinstance(students, list)
        assert len(students) >= 5
        for s in students:
            assert s["id"] != alice_user["id"]
            assert "password_hash" not in s

    def test_endorse_increments(self, alice_session, bob_user):
        before = alice_session.get(f"{API}/students/{bob_user['id']}", timeout=15).json()
        before_count = before["reputation"]["endorsements"]
        r = alice_session.post(f"{API}/students/{bob_user['id']}/endorse", timeout=15)
        assert r.status_code == 200
        assert r.json()["reputation"]["endorsements"] == before_count + 1


# ---------- match ----------

class TestMatch:
    def test_ai_match_returns_ranked_results(self, alice_session):
        r = alice_session.post(f"{API}/match", json={
            "goal": "I need a frontend developer and a biology researcher for a medical AI hackathon"
        }, timeout=90)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "matches" in data
        matches = data["matches"]
        # Local fallback still guarantees at least 3-5
        assert 1 <= len(matches) <= 5
        for m in matches:
            assert "student" in m
            assert "reason" in m and isinstance(m["reason"], str) and len(m["reason"]) > 3
            assert "score" in m
            assert isinstance(m["student"]["id"], str)


# ---------- projects ----------

class TestProjects:
    def test_list_seeded_projects(self, alice_session):
        r = alice_session.get(f"{API}/projects", timeout=15)
        assert r.status_code == 200
        projects = r.json()
        assert len(projects) >= 5
        titles = [p["title"] for p in projects]
        assert any("Plant Disease" in t for t in titles)
        for p in projects:
            assert "owner" in p and p["owner"] is not None
            assert "id" in p
            assert "category" in p

    def test_create_project_and_appears_in_list(self, alice_session):
        title = f"TEST Project {uuid.uuid4().hex[:6]}"
        payload = {
            "title": title, "description": "TEST desc", "category": "AI / Machine Learning",
            "roles_needed": ["Frontend"], "skills": ["React"], "timeline": "1 month",
        }
        r = alice_session.post(f"{API}/projects", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        created = r.json()
        assert created["title"] == title
        assert created["owner"]["id"]
        # List includes it
        listed = alice_session.get(f"{API}/projects", timeout=15).json()
        assert any(p["title"] == title for p in listed)
        return created

    def test_join_other_project(self, alice_session, bob_session):
        # Bob creates a project, Alice joins
        payload = {
            "title": f"TEST BobProj {uuid.uuid4().hex[:6]}", "description": "bob desc",
            "category": "Startups", "roles_needed": ["ML"], "skills": ["Python"],
        }
        created = bob_session.post(f"{API}/projects", json=payload, timeout=15).json()
        pid = created["id"]
        r = alice_session.post(f"{API}/projects/{pid}/join", timeout=15)
        assert r.status_code == 200
        assert r.json().get("ok") is True


# ---------- opportunities ----------

class TestOpportunities:
    def test_list_seeded_opps(self, alice_session):
        r = alice_session.get(f"{API}/opportunities", timeout=15)
        assert r.status_code == 200
        opps = r.json()
        assert len(opps) >= 5
        for o in opps:
            for key in ("title", "org", "type", "description"):
                assert key in o


# ---------- messages ----------

class TestMessages:
    def test_send_and_fetch_message(self, alice_session, bob_user):
        text = f"hey bob {uuid.uuid4().hex[:6]}"
        r = alice_session.post(f"{API}/messages", json={"to_user_id": bob_user["id"], "text": text}, timeout=15)
        assert r.status_code == 200, r.text
        # Fetch thread from Alice's side
        thread = alice_session.get(f"{API}/messages/{bob_user['id']}", timeout=15).json()
        assert any(m["text"] == text for m in thread)

    def test_conversations_lists_partner(self, alice_session, bob_user):
        convos = alice_session.get(f"{API}/conversations", timeout=15).json()
        assert any(c["user"]["id"] == bob_user["id"] for c in convos)


# ---------- forum ----------

class TestForum:
    def test_list_forum(self, alice_session):
        r = alice_session.get(f"{API}/forum", timeout=15)
        assert r.status_code == 200
        posts = r.json()
        assert len(posts) >= 3
        for p in posts:
            assert "author" in p
            assert "comment_count" in p

    def test_upvote_increments(self, alice_session):
        posts = alice_session.get(f"{API}/forum", timeout=15).json()
        pid = posts[0]["id"]
        before = posts[0]["upvotes"]
        r = alice_session.post(f"{API}/forum/{pid}/upvote", timeout=15)
        assert r.status_code == 200
        after = alice_session.get(f"{API}/forum", timeout=15).json()
        after_post = next(p for p in after if p["id"] == pid)
        assert after_post["upvotes"] == before + 1

    def test_create_post_and_comment(self, alice_session):
        title = f"TEST post {uuid.uuid4().hex[:6]}"
        r = alice_session.post(f"{API}/forum", json={
            "community": "Robotics", "title": title, "body": "TEST body",
        }, timeout=15)
        assert r.status_code == 200, r.text
        post = r.json()
        pid = post["id"]

        c = alice_session.post(f"{API}/forum/{pid}/comments", json={"text": "TEST comment"}, timeout=15)
        assert c.status_code == 200
        assert c.json()["text"] == "TEST comment"
        comments = alice_session.get(f"{API}/forum/{pid}/comments", timeout=15).json()
        assert any(x["text"] == "TEST comment" for x in comments)


# ---------- dashboard ----------

class TestDashboard:
    def test_dashboard_shape(self, alice_session):
        r = alice_session.get(f"{API}/dashboard", timeout=15)
        assert r.status_code == 200
        d = r.json()
        for k in ("my_projects", "opportunities", "suggested_teammates", "stats"):
            assert k in d
        assert d["stats"]["students"] >= 5
        assert d["stats"]["opportunities"] >= 5
