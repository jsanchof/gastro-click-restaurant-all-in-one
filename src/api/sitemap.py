# api/sitemap.py
from flask import Blueprint, Response
from datetime import datetime

sitemap_bp = Blueprint('sitemap', __name__)

@sitemap_bp.route('/sitemap.xml', methods=['GET'])
def sitemap():
    pages = [
        "/", "/menu", "/contacto", "/nosotros", "/login", "/registro"
    ]

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for page in pages:
        xml += "  <url>\n"
        xml += f"    <loc>https://sample-service-name-0664.onrender.com{page}</loc>\n"
        xml += f"    <lastmod>{datetime.utcnow().date()}</lastmod>\n"
        xml += "    <changefreq>monthly</changefreq>\n"
        xml += "    <priority>0.8</priority>\n"
        xml += "  </url>\n"

    xml += "</urlset>\n"
    return Response(xml, mimetype='application/xml')
