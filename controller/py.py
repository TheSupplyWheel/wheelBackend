from twilio.rest import Client

# account_sid = 'AC7526bd4af40d83f63312572f54b61c58'
# auth_token = '76ad6b8190c3cf2b40d1ba55eb21b742'
client = Client(account_sid, auth_token)

message = client.messages.create(
  from_='whatsapp:+14155238886',
  body='Your otp is 456456',
  to='whatsapp:+919478181139'
)

print(message.sid)
