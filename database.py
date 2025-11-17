import sqlite3

connection = sqlite3.connect('Notes.db')
cursor = connection.cursor()

user_db_command = """CREATE TABLE IF NOT EXISTS USERS(
                            first_name VARCHAR(50),
                            last_name VARCHAR(50),
                            email VARCHAR(50) primary key,
                            password VARCHAR(50) not null)"""

cursor.execute(user_db_command)

notes_db_command = """CREATE TABLE IF NOT EXISTS NOTES(
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title VARCHAR(50),
                            description VARCHAR(150),
                            category VARCHAR(50),
                            pined BOOLEAN"""

cursor.execute(notes_db_command)

# cmd2 = """INSERT INTO USERS(first_name,last_name,email,password)values('tester','test','tester@gmail.com','tester')"""
# cursor.execute(cmd2)
connection.commit()

# ans = cursor.execute("select * from USERS").fetchall()

# for i in ans:
#     print(i)