

### DB Creation 

Here are the **MySQL commands to create the database and user** that match your Django settings exactly.

### 🔹 Django config you gave

* Database: `dbraxis`
* User: `userraxis`
* Password: `userraxis1234`
* Host: `localhost`
* Port: `3309`

---

## ✅ 1. Login to MySQL (custom port 3309)

```bash
mysql -u root -p -P 3309
```

---

## ✅ 2. Create Database

```sql
CREATE DATABASE dbraxis
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## ✅ 3. Create User

```sql
CREATE USER 'userraxis'@'localhost'
IDENTIFIED BY 'userraxis1234';
```

---

## ✅ 4. Grant Permissions

```sql
GRANT ALL PRIVILEGES ON dbraxis.* TO 'userraxis'@'localhost';
FLUSH PRIVILEGES;
```

---

## ✅ 5. Verify

```sql
SHOW DATABASES;
SHOW GRANTS FOR 'userraxis'@'localhost';
```

---

## ✅ 6. Test Django Connection

```bash
python manage.py migrate
```

---

### ⚠️ If MySQL version is **5.7 or older**

Use this instead:

```sql
CREATE USER 'userraxis'@'localhost' IDENTIFIED BY PASSWORD PASSWORD('userraxis1234');
```

---

If you want:

* Remote access (`%`)
* MariaDB version
* Docker MySQL setup
* Production-secure permissions

Tell me 👍
