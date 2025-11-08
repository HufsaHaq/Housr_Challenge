from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'housr_data.json'

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return {
        'users': {},
        'transactions': [],
        'perks': [
            {'id': 1, 'name': 'Costa Coffee £5 Voucher', 'cost': 50, 'category': 'Food'},
            {'id': 2, 'name': 'Gym Pass - 1 Week', 'cost': 100, 'category': 'Fitness'},
            {'id': 3, 'name': 'Cinema Ticket', 'cost': 75, 'category': 'Entertainment'},
            {'id': 4, 'name': 'Amazon £10 Voucher', 'cost': 100, 'category': 'Shopping'},
            {'id': 5, 'name': 'Spotify Premium - 1 Month', 'cost': 120, 'category': 'Entertainment'}
        ]
    }

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)


data = load_data()
if 'student123' not in data['users']:
    data['users']['student123'] = {
        'id': 'student123',
        'name': 'Alex Johnson',
        'email': 'alex.j@university.ac.uk',
        'balance': 0,
        'total_spent': 0,
        'total_earned': 0,
        'payment_streak': 0,
        'tier': 'Bronze'
    }
    save_data(data)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    data = load_data()
    user = data['users'].get(user_id)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/api/payment', methods=['POST'])
def process_payment():
    data = load_data()
    payment_data = request.json
    
    user_id = payment_data.get('user_id')
    amount = float(payment_data.get('amount'))
    payment_type = payment_data.get('type', 'rent')
    
    if user_id not in data['users']:
        return jsonify({'error': 'User not found'}), 404
    
    # Calculate rewards (5% cashback)
    credits_earned = round(amount * 0.05, 2)
    
    # Bonus for streaks
    user = data['users'][user_id]
    user['payment_streak'] += 1
    
    if user['payment_streak'] >= 3:
        bonus = round(credits_earned * 0.1, 2)
        credits_earned += bonus
    
    # Update user balance
    user['balance'] += credits_earned
    user['total_spent'] += amount
    user['total_earned'] += credits_earned
    
    # Update tier
    if user['total_spent'] >= 5000:
        user['tier'] = 'Gold'
    elif user['total_spent'] >= 2000:
        user['tier'] = 'Silver'
    
    # Record transaction
    transaction = {
        'id': len(data['transactions']) + 1,
        'user_id': user_id,
        'type': payment_type,
        'amount': amount,
        'credits_earned': credits_earned,
        'timestamp': datetime.now().isoformat(),
        'description': f'{payment_type.capitalize()} Payment'
    }
    
    data['transactions'].append(transaction)
    save_data(data)
    
    return jsonify({
        'success': True,
        'credits_earned': credits_earned,
        'new_balance': user['balance'],
        'payment_streak': user['payment_streak'],
        'tier': user['tier']
    })

@app.route('/api/transactions/<user_id>', methods=['GET'])
def get_transactions(user_id):
    data = load_data()
    user_transactions = [t for t in data['transactions'] if t['user_id'] == user_id]
    return jsonify(user_transactions)

@app.route('/api/perks', methods=['GET'])
def get_perks():
    data = load_data()
    return jsonify(data['perks'])

@app.route('/api/redeem', methods=['POST'])
def redeem_credits():
    data = load_data()
    redemption_data = request.json
    
    user_id = redemption_data.get('user_id')
    redemption_type = redemption_data.get('type')
    amount = float(redemption_data.get('amount', 0))
    perk_id = redemption_data.get('perk_id')
    
    if user_id not in data['users']:
        return jsonify({'error': 'User not found'}), 404
    
    user = data['users'][user_id]
    
    if redemption_type == 'rent_discount':
        if user['balance'] < amount:
            return jsonify({'error': 'Insufficient credits'}), 400
        
        user['balance'] -= amount
        
        transaction = {
            'id': len(data['transactions']) + 1,
            'user_id': user_id,
            'type': 'redemption',
            'amount': -amount,
            'credits_earned': 0,
            'timestamp': datetime.now().isoformat(),
            'description': f'Applied £{amount} to rent'
        }
        data['transactions'].append(transaction)
        
    elif redemption_type == 'perk':
        perk = next((p for p in data['perks'] if p['id'] == perk_id), None)
        if not perk:
            return jsonify({'error': 'Perk not found'}), 404
        
        if user['balance'] < perk['cost']:
            return jsonify({'error': 'Insufficient credits'}), 400
        
        user['balance'] -= perk['cost']
        
        transaction = {
            'id': len(data['transactions']) + 1,
            'user_id': user_id,
            'type': 'redemption',
            'amount': -perk['cost'],
            'credits_earned': 0,
            'timestamp': datetime.now().isoformat(),
            'description': f'Redeemed: {perk["name"]}'
        }
        data['transactions'].append(transaction)
    
    save_data(data)
    
    return jsonify({
        'success': True,
        'new_balance': user['balance'],
        'message': 'Redemption successful!'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)