import hashlib

password = "admin2024"
hash_result = hashlib.sha256(password.encode()).hexdigest()
print(f"Password: {password}")
print(f"Hash: {hash_result}")
