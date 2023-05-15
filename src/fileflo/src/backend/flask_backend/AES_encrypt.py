# Standard library imports
import base64
import binascii
import io
import mimetypes
import re
from textwrap import dedent

# Third-party imports
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt
from Crypto.Random import get_random_bytes
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

BUFFER_SIZE = 1024 * 1024  # The size in bytes that we read, encrypt and write to at once

# Create the Flask app
app = Flask(__name__)
CORS(app)

# Encrypt a file using a password
@app.route('/encrypt', methods=['POST'])
def encrypt():
    """
    Encrypt a file using a password

    :return: The encrypted file as a hex string
    """
    # Get the password from the POST request
    password = request.form['passphrase']

    # Get the file data from the POST request
    file_data = request.files['file'].read()

    salt = get_random_bytes(32)  # Generate salt
    key = scrypt(password, salt, key_len=32, N=2**17, r=8, p=1)  # Generate a key using the password and salt

    encrypted_data = b''

    # Create a cipher object to encrypt data
    cipher = AES.new(key, AES.MODE_GCM)  # Create a cipher object to encrypt data
    encrypted_data += salt  # Add the salt to the encrypted data
    encrypted_data += cipher.nonce  # Add the nonce to the encrypted data

    # Encrypt the data
    data_len = len(file_data)
    for i in range(0, data_len, BUFFER_SIZE):
        data_chunk = file_data[i:i+BUFFER_SIZE]
        encrypted_chunk = cipher.encrypt(data_chunk)  # Encrypt the data we read
        encrypted_data += encrypted_chunk  # Add the encrypted chunk to the encrypted data

    # Signal to the cipher that we are done and get the tag
    tag = cipher.digest()

    encrypted_data += tag  # Add the tag to the encrypted data

    # Convert the encrypted data to hex and return the response
    hex_data = binascii.hexlify(encrypted_data)
    return jsonify({'data': {'hex_data': hex_data.decode()}})

# Decrypt a file using a password
@app.route('/decrypt', methods=["POST"])
def decrypt():
    """
    Decrypt a file using a password

    :return: The decrypted file as a hex string
    """
    password = request.form.get('passphrase') # Get the password from the POST request
    hex_data = request.form.get('hex_data')
    file_type = request.form.get('file_type')

    # Convert the hex data to bytes
    encrypted_data = binascii.unhexlify(hex_data)
    
    salt = encrypted_data[:32]  # Get the salt from the encrypted data
    key = scrypt(password, salt, key_len=32, N=2**17, r=8, p=1)  # Generate a key using the password and salt
    
    nonce = encrypted_data[32:48]  # Get the nonce from the encrypted data
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)  # Create a cipher object to decrypt data
    
    # Decrypt the data
    data = encrypted_data[48:-16]  # Get the encrypted data
    decrypted_data = cipher.decrypt(data)  # Decrypt the data
    
    # Verify the tag for decryption verification
    tag = encrypted_data[-16:]  # Get the tag from the encrypted data
    try:
        cipher.verify(tag)  # Verify the tag
        print("Tag verification successful")
    except ValueError:
        print("Tag verification failed")
    
    # Return the decrypted data
    file_extension = mimetypes.guess_extension(file_type)
    decrypted_data_file = io.BytesIO(decrypted_data)
    download_name = f'decrypted_file{file_extension}'
    return send_file(decrypted_data_file, mimetype=file_type, as_attachment=True, download_name=download_name)

# Generate a pair of RSA keys
@app.route('/generate_keys', methods=['GET'])
def RSA_generate_pairs():
    """
    Generate a pair of RSA keys

    :return: The private and public keys as a JSON response
    """
    # Generate a private key
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )

    # Generate a public key from the private key
    public_key = private_key.public_key()

    # Serialize the private key to PEM format
    pem_private_key = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )

    # Serialize the public key to PEM format
    pem_public_key = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )

    # Return the keys as a JSON response
    return jsonify({
        'private_key': pem_private_key.decode('utf-8'),
        'public_key': pem_public_key.decode('utf-8')
    })

# Encrypt a passphrase using a public key
@app.route('/encrypt_passphrase', methods=['POST'])
def encrypt_passphrase():
    """
    Encrypt a passphrase using a public key

    :return: The encrypted passphrase as a base64-encoded string
    """
    # Get the public key and hashed passphrase from the request
    public_key_pem = request.json['public_key']
    hashed_passphrase = request.json['hashed_passphrase']

    # Load the public key from its PEM format
    public_key = serialization.load_pem_public_key(
        public_key_pem.encode(),
        backend=default_backend()
    )

    # Encrypt the hashed passphrase using the public key
    encrypted_passphrase = public_key.encrypt(
        hashed_passphrase.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Return the encrypted passphrase as a base64-encoded string
    return jsonify({"encrypted_passphrase": base64.b64encode(encrypted_passphrase).decode()})

# Check if a string is a valid PEM format
def is_pem(pem_string):
    """
    Check if a string is a valid PEM format

    :param pem_string: The string to check
    """
    pattern = re.compile(
        r'^-----BEGIN [A-Z ]+-----\n'
        r'[a-zA-Z0-9/+=\n]+'
        r'^-----END [A-Z ]+-----\n?$',
        re.MULTILINE | re.ASCII
    )
    return bool(pattern.match(pem_string))

# Format a private key to PEM format
def format_private_key_pem(private_key_str):
    """
    Format a private key to PEM format

    :param private_key_str: The private key to format
    """
    header = "-----BEGIN PRIVATE KEY-----\n"
    footer = "\n-----END PRIVATE KEY-----"
    key_body = private_key_str[len(header):-len(footer)].replace(" ", "")  # Remove extra spaces
    formatted_key_body = ''.join([key_body[i:i + 64] + '\n' for i in range(0, len(key_body), 64)]).rstrip()
    return header + formatted_key_body + footer

# Decrypt a passphrase using a private key
@app.route('/decrypt_passphrase', methods=['POST'])
def decrypt_passphrase():
    """
    Decrypt a passphrase using a private key
    
    :return: The decrypted passphrase as a string
    """
    # Get the private key and encrypted passphrase from the request
    private_key_pem = request.json['private_key']
    encrypted_passphrase = request.json['encrypted_passphrase']
    
    # Remove extra spaces from the private key
    private_key_pem = dedent(private_key_pem)
    encrypted_passphrase = dedent(encrypted_passphrase)

    # Check if the private key and encrypted passphrase are present
    if encrypted_passphrase is None:
        return jsonify({"error": "encrypted_passphrase is missing"}), 400
    # Check if the private key is a valid PEM format
    if not is_pem(private_key_pem):
        # If private key is not in valid PEM format, try to format it using format_private_key_pem function
        private_key_pem = format_private_key_pem(private_key_pem)
        print(private_key_pem)
        # Check again if the private key is a valid PEM format after formatting
        if not is_pem(private_key_pem):
            return jsonify({"error": "Invalid PEM format"})

    # Load the private key from its PEM format
    private_key = serialization.load_pem_private_key(
        private_key_pem.encode(),
        password=None,
        backend=default_backend()
    )

    # Decrypt the encrypted passphrase using the private key
    decrypted_passphrase = private_key.decrypt(
        base64.b64decode(encrypted_passphrase),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )

    # Return the decrypted passphrase as a string
    return jsonify({"decrypted_passphrase": decrypted_passphrase.decode()})

if __name__ == "__main__":
    app.run(debug=True)
