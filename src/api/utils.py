import os
from flask import jsonify, url_for, render_template
import smtplib
from email.message import EmailMessage

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"

def send_email(to_email, subject, body, is_html=False):
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = os.getenv("MAIL_USERNAME")
    msg['To'] = to_email
    msg["Bcc"] = os.getenv("MAIL_USERNAME")

    if is_html:
        msg.set_content("El contenido requiere soporte para HTML")
        msg.add_alternative(body, subtype="html")
    else:
        msg.set_content(body)

    try:
        with smtplib.SMTP(os.getenv("MAIL_SERVER"), int(os.getenv("MAIL_PORT"))) as smtp:
            smtp.starttls() #TLS
            smtp.login(os.getenv("MAIL_USERNAME"), os.getenv("MAIL_PASSWORD"))
            smtp.send_message(msg)
            smtp.quit()
    except Exception as e:
        print(f"Error al enviar correo: {e}")

# Envio de correos de reservas
def send_email_reservation(data):
    guest_name = data.get('guest_name')
    guest_phone = data.get('guest_phone')
    email = data.get('email')
    quantity = data.get('quantity')
    start_date_time = data.get('start_date_time')
    additional_details = data.get('additional_details')
    

    subject = f"Nueva solicitud de Reserva de {guest_name}"

    admin_email = os.getenv('MAIL_USERNAME')
    #send_email(to, subject, message, is_html=False)
    html_user_body = render_template("email_pagina_contacto.html", guest_name = guest_name)
    html_admin_body = render_template("email_reserva_admin.html", guest_name=guest_name, guest_phone = guest_phone,
                                       quantity = quantity, start_date_time = start_date_time, additional_details = additional_details)
    
    send_email(email, "Tu solicitud de reserva fue recivida!", html_user_body, is_html=True)
    send_email(admin_email, subject, html_admin_body, is_html=True)
    return jsonify({"msg": "Correo enviado con html"})