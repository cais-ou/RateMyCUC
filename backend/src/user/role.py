from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/assign-role', methods=['POST'])
def assign_role():
    # 直接返回角色为 'normal'，不处理任何传入的数据
    return jsonify({'role': 'normal'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
