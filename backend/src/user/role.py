from flask import Flask, request, jsonify,url_for,render_template_string
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask import redirect
import requests

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'sha256=387bd710969a9dd8a31f6f66872c3c90d479e74b1fe3f523ca923ad6cd35823c'
app.config['MAIL_SERVER'] = 'smtp.qq.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = '3432878584@qq.com'
app.config['MAIL_PASSWORD'] = 'jllclveygyvhdcac'
app.config['MAIL_DEFAULT_SENDER'] = '3432878584@qq.com'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mysecretpassword@localhost:6543/zombo'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app) 

mail = Mail(app)
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True)
    username = db.Column(db.String, unique=True)
    password = db.Column(db.String)
    role = db.Column(db.String)

#创建用户
@app.route('/user', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(email=data['email'], username=data['username'], password=data['password'], role=data['role'])
    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({'success': 'User created successfully', 'user_id': new_user.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

#寻找用户
@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'role': user.role,
        })
    else:
        return jsonify({'error': 'User not found'}), 404

#修改用户信息
@app.route('/user/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user:
        data = request.json
        user.email = data.get('email', user.email)
        user.username = data.get('username', user.username)
        user.password = data.get('password', user.password)
        user.role = data.get('role', user.role)
        db.session.commit()
        return jsonify({'success': 'User updated successfully'})
    else:
        return jsonify({'error': 'User not found'}), 404

#删除用户
@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': 'User deleted successfully'})
    else:
        return jsonify({'error': 'User not found'}), 404

#获取所有用户
@app.route('/users', methods=['GET'])
def list_users():
    users_query = User.query.all()
    users = [{
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'role': user.role,
    } for user in users_query]
    return jsonify(users)

@app.route('/assign-role', methods=['POST'])
def assign_role():
    # 直接返回角色为 'normal'
    return jsonify({'role': 'normal'})

# 发送邮件
@app.route('/send-mail', methods=['POST'])
def send_mail():
    try:
        email = request.json.get('email')
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        token = s.dumps(email, salt='email-confirm')
        link = url_for('confirm_email', token=token, _external=True)
        msg = Message("Confirm Your Email", recipients=[email])
        msg.body = f'请点击以下链接进行验证，随后重新登录： {link}'
        mail.send(msg)
        return jsonify({'message': '验证邮件成功发送'}), 200
    except Exception as e:
        app.logger.error(f'Unexpected error: {e}') 
        return jsonify({'error': 'Internal Server Error'}), 500

#邮件验证
@app.route('/confirm-email/<token>')
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
        data = {'email': email}
        headers = {'Content-Type': 'application/json'}
        response = requests.post('http://localhost:3000/api/auth/authentication', json=data, headers=headers)
        if response.status_code == 200 or 201 :
             return render_template_string("""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="5;url=http://localhost:3002/main">
    <title>Verification Success</title>
    <script>
        setTimeout(function() {
            window.location.href = "http://localhost:3002/main";
        }, 5000);
    </script>
</head>
<body>
    <h1>验证成功！</h1>
    <p>您会在5秒后返回，请重新登录...</p>
</body>
</html>
""")
        else:
            return jsonify({'error': '用户认证失败，请联系管理员'}), response.status_code
    except SignatureExpired:
        return 'The confirmation link is expired!', 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
