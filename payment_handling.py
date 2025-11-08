from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from datetime import datetime
import json
import os
import math

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
        ],
        'sponsors': [
            {
                'id': 1,
                'name': 'Mooboo Bubble Tea',
                'category': 'Food & Drink',
                'address': '47 Oxford Road, Manchester M1 4PF',
                'lat': 53.4753,
                'lng': -2.2376,
                'offers': '10% off with Housr wallet',
                'phone': '0161 236 8899'
            },
            {
                'id': 2,
                'name': 'Costa Coffee Manchester',
                'category': 'Food & Drink',
                'address': '23 Piccadilly Gardens, Manchester M1 1RG',
                'lat': 53.4808,
                'lng': -2.2368,
                'offers': 'Free pastry with any coffee',
                'phone': '0161 228 3456'
            },
            {
                'id': 3,
                'name': 'PureGym Manchester',
                'category': 'Fitness',
                'address': '89 Portland Street, Manchester M1 4GX',
                'lat': 53.4779,
                'lng': -2.2401,
                'offers': 'First week free pass',
                'phone': '0161 819 2345'
            },
            {
                'id': 4,
                'name': 'Odeon Cinema',
                'category': 'Entertainment',
                'address': 'The Printworks, Manchester M4 2BS',
                'lat': 53.4841,
                'lng': -2.2399,
                'offers': '£2 off tickets',
                'phone': '0333 014 4501'
            },
            {
                'id': 5,
                'name': 'Waterstones Manchester',
                'category': 'Education',
                'address': '91 Deansgate, Manchester M3 2BW',
                'lat': 53.4809,
                'lng': -2.2468,
                'offers': '15% off textbooks',
                'phone': '0161 837 3000'
            },
            {
                'id': 6,
                'name': 'Dominos Pizza',
                'category': 'Food & Drink',
                'address': '156 Oxford Road, Manchester M13 9GP',
                'lat': 53.4689,
                'lng': -2.2345,
                'offers': '50% off student orders',
                'phone': '0161 273 7777'
            },
            {
                'id': 7,
                'name': 'The Gym Group',
                'category': 'Fitness',
                'address': '2 Sackville Street, Manchester M1 3LY',
                'lat': 53.4764,
                'lng': -2.2355,
                'offers': 'Student discount 20%',
                'phone': '0161 237 9191'
            },
            {
                'id': 8,
                'name': 'Gong Cha Bubble Tea',
                'category': 'Food & Drink',
                'address': '8 Stevenson Square, Manchester M1 1DB',
                'lat': 53.4823,
                'lng': -2.2348,
                'offers': 'Buy 2 get 1 free',
                'phone': '0161 228 6688'
            },
            {
                'id': 9,
                'name': 'Pendulum Hotel',
                'category': 'Hotels & Accommodation',
                'address': 'Sackville St, Manchester M1 3BB',
                'lat': 53.4740,
                'lng': -2.2300,
                'offers': '5% off student rooms',
                'phone': '0161 955 8000'
            }

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

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula (in km)"""
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

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

@app.route('/api/sponsors', methods=['GET'])
def get_sponsors():
    data = load_data()
    user_lat = request.args.get('lat', type=float)
    user_lng = request.args.get('lng', type=float)
    
    sponsors = data.get('sponsors', [])
    
    # Calculate distance if user location provided
    if user_lat is not None and user_lng is not None:
        for sponsor in sponsors:
            distance = calculate_distance(user_lat, user_lng, sponsor['lat'], sponsor['lng'])
            sponsor['distance'] = round(distance, 2)
        
        # Sort by distance
        sponsors = sorted(sponsors, key=lambda x: x.get('distance', float('inf')))
    
    return jsonify(sponsors)

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