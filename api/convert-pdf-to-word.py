from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs
import json
import base64
import tempfile
import os
from pdf2docx import Converter

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)

            # Parse JSON body
            body = json.loads(post_data.decode('utf-8'))
            pdf_base64 = body.get('pdf')

            if not pdf_base64:
                self.send_error(400, 'Missing PDF data')
                return

            # Decode base64 PDF
            pdf_data = base64.b64decode(pdf_base64)

            # Create temporary files
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as pdf_file:
                pdf_file.write(pdf_data)
                pdf_path = pdf_file.name

            with tempfile.NamedTemporaryFile(suffix='.docx', delete=False) as docx_file:
                docx_path = docx_file.name

            try:
                # Convert PDF to DOCX
                cv = Converter(pdf_path)
                cv.convert(docx_path, start=0, end=None)
                cv.close()

                # Read converted DOCX
                with open(docx_path, 'rb') as f:
                    docx_data = f.read()

                # Encode to base64
                docx_base64 = base64.b64encode(docx_data).decode('utf-8')

                # Get file stats
                pdf_size = len(pdf_data)
                docx_size = len(docx_data)

                # Send response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()

                response = {
                    'success': True,
                    'docx': docx_base64,
                    'metadata': {
                        'pdfSize': pdf_size,
                        'docxSize': docx_size
                    }
                }

                self.wfile.write(json.dumps(response).encode('utf-8'))

            finally:
                # Cleanup temp files
                if os.path.exists(pdf_path):
                    os.unlink(pdf_path)
                if os.path.exists(docx_path):
                    os.unlink(docx_path)

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()

            error_response = {
                'success': False,
                'error': str(e)
            }

            self.wfile.write(json.dumps(error_response).encode('utf-8'))

    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
