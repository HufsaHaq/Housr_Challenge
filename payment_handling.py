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
            {'id': 1, 'name': 'Boba Tea', 'cost': 5.50, 'category': 'Food & Drink'},
            {'id': 2, 'name': 'Costa Coffee', 'cost': 4.20, 'category': 'Food & Drink'},
            {'id': 3, 'name': 'Cinema Ticket', 'cost': 12.00, 'category': 'Entertainment'},
            {'id': 4, 'name': 'Gym Day Pass', 'cost': 8.00, 'category': 'Fitness'},
            {'id': 5, 'name': 'Pizza', 'cost': 10.00, 'category': 'Food & Drink'},
            {'id': 6, 'name': 'Student Event Ticket', 'cost': 15.00, 'category': 'Events'},
            {'id': 7, 'name': 'Book Store Voucher', 'cost': 20.00, 'category': 'Education'},
            {'id': 8, 'name': 'Laundry Service', 'cost': 6.00, 'category': 'Services'}
        ]
    }

def save_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def calculate_tier(wallet_spent):
    if wallet_spent >= 500:
        return 'Platinum'
    elif wallet_spent >= 200:
        return 'Gold'
    elif wallet_spent >= 50:
        return 'Silver'
    else:
        return 'Bronze'

data = load_data()
if 'student123' not in data['users']:
    data['users']['student123'] = {
        'id': 'student123',
        'name': 'Alex Johnson',
        'email': 'alex.j@university.ac.uk',
        'wallet_balance': 0,
        'total_earned': 0,
        'wallet_spent': 0,
        'rent_payments': 0,
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
    user['wallet_balance'] += credits_earned
    user['total_earned'] += credits_earned
    user['rent_payments'] += amount
    
    # Record transaction
    transaction = {
        'id': len(data['transactions']) + 1,
        'user_id': user_id,
        'type': 'rent_payment',
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
        'new_balance': user['wallet_balance'],
        'payment_streak': user['payment_streak'],
        'tier': user['tier']
    })

@app.route('/api/wallet/spend', methods=['POST'])
def wallet_spend():
    data = load_data()
    spend_data = request.json
    
    user_id = spend_data.get('user_id')
    amount = float(spend_data.get('amount'))
    item_name = spend_data.get('item_name', 'Purchase')
    
    if user_id not in data['users']:
        return jsonify({'error': 'User not found'}), 404
    
    user = data['users'][user_id]
    
    if user['wallet_balance'] < amount:
        return jsonify({'error': 'Insufficient wallet balance'}), 400
    
    # Deduct from wallet and track spending
    user['wallet_balance'] -= amount
    user['wallet_spent'] += amount
    
    # Update tier based on wallet spending
    user['tier'] = calculate_tier(user['wallet_spent'])
    
    # Record transaction
    transaction = {
        'id': len(data['transactions']) + 1,
        'user_id': user_id,
        'type': 'wallet_spend',
        'amount': -amount,
        'credits_earned': 0,
        'timestamp': datetime.now().isoformat(),
        'description': f'Spent on {item_name}'
    }
    
    data['transactions'].append(transaction)
    save_data(data)
    
    return jsonify({
        'success': True,
        'new_balance': user['wallet_balance'],
        'wallet_spent': user['wallet_spent'],
        'tier': user['tier'],
        'message': f'Successfully spent £{amount:.2f}'
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
    perk_id = redemption_data.get('perk_id')
    
    if user_id not in data['users']:
        return jsonify({'error': 'User not found'}), 404
    
    user = data['users'][user_id]
    perk = next((p for p in data['perks'] if p['id'] == perk_id), None)
    
    if not perk:
        return jsonify({'error': 'Item not found'}), 404
    
    if user['wallet_balance'] < perk['cost']:
        return jsonify({'error': 'Insufficient wallet balance'}), 400
    
    # Deduct from wallet and track spending
    user['wallet_balance'] -= perk['cost']
    user['wallet_spent'] += perk['cost']
    
    # Update tier based on wallet spending
    user['tier'] = calculate_tier(user['wallet_spent'])
    
    transaction = {
        'id': len(data['transactions']) + 1,
        'user_id': user_id,
        'type': 'wallet_spend',
        'amount': -perk['cost'],
        'credits_earned': 0,
        'timestamp': datetime.now().isoformat(),
        'description': f'Purchased: {perk["name"]}'
    }
    data['transactions'].append(transaction)
    
    save_data(data)
    
    return jsonify({
        'success': True,
        'new_balance': user['wallet_balance'],
        'wallet_spent': user['wallet_spent'],
        'tier': user['tier'],
        'message': 'Purchase successful!'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)