from flask import Flask, render_template, request, redirect
import sqlite3
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# ---------------- DATABASE SETUP ---------------- #

def get_db_path():
    """Get the absolute path of the database file."""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Notes.db')

def init_db():
    """Create tables if they do not exist."""
    db_path = get_db_path()
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    # Create USERS table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS USERS(
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT PRIMARY KEY,
            password TEXT NOT NULL
        )
    """)

    # Create NOTES table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS NOTES(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT
        )
    """)

    connection.commit()
    connection.close()

# Initialize database on app start
init_db()


# ---------------- ROUTES ---------------- #

@app.route('/')
def dashboard():
    return render_template('dashboard.html')


# ---------------- NOTES ---------------- #

@app.route('/note')
def note():
    return render_template('addnote.html')

@app.route('/addnote', methods=['POST'])
def addnotes():
    title = request.form.get('title')
    description = request.form.get('description')

    db_path = get_db_path()
    try:
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        cursor.execute("INSERT INTO NOTES (title, description) VALUES (?, ?)", (title, description))
        connection.commit()
        connection.close()

        return redirect('/')
        # return redirect(f'/?title={title}&description={description}')
    except Exception as e:
        print('Error:', e)
        return f"Error: {e}", 500


# ---------------- USER LOGIN / LOGOUT ---------------- #

@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/login_validation', methods=['POST'])
def login_validation():
    email = request.form.get('email')
    password = request.form.get('password')

    db_path = get_db_path()
    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    user = cursor.execute("SELECT * FROM USERS WHERE email=? AND password=?", (email, password)).fetchall()
    connection.close()

    if len(user) > 0:
        return redirect(f'/home?fname={user[0][0]}&lname={user[0][1]}&email={user[0][2]}')
    else:
        return render_template('login.html', msg="Invalid email or password")


@app.route('/home')
def home():
    fname = request.args.get('fname')
    lname = request.args.get('lname')
    email = request.args.get('email')

    return render_template('home.html', fname=fname, lname=lname, email=email)


@app.route('/registration')
def registration():
    return render_template('registration.html')


@app.route('/add_user', methods=['POST'])
def add_user():
    fname = request.form.get('fname')
    lname = request.form.get('lname')
    email = request.form.get('email')
    password = request.form.get('password')

    db_path = get_db_path()
    try:
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        existing_user = cursor.execute("SELECT * FROM USERS WHERE email=?", (email,)).fetchall()

        if len(existing_user) > 0:
            connection.close()
            return render_template('registration.html', msg="User already exists")
        else:
            cursor.execute(
                "INSERT INTO USERS (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
                (fname, lname, email, password)
            )
            connection.commit()
            connection.close()

            return redirect(f'/home?fname={fname}&lname={lname}&email={email}')
    except Exception as e:
        print('Error:', e)
        return f"Error: {e}", 500


@app.route('/logout')
def logout():
    return redirect('/')


# ---------------- MAIN ---------------- #

if __name__ == '__main__':
    app.run(debug=True)
