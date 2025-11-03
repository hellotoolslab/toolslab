from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import tempfile
import os
from pdf2docx import Converter
import logging

app = Flask(__name__)
CORS(app)  # Allow requests from your Vercel domain

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'}), 200

@app.route('/convert', methods=['POST'])
def convert_pdf_to_word():
    try:
        data = request.get_json()

        if not data or 'pdf' not in data:
            return jsonify({'error': 'No PDF data provided'}), 400

        pdf_base64 = data['pdf']

        # Decode base64 PDF
        try:
            pdf_bytes = base64.b64decode(pdf_base64)
        except Exception as e:
            logger.error(f"Base64 decode error: {str(e)}")
            return jsonify({'error': 'Invalid base64 PDF data'}), 400

        # Create temporary files
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as pdf_file:
            pdf_path = pdf_file.name
            pdf_file.write(pdf_bytes)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as docx_file:
            docx_path = docx_file.name

        try:
            # Convert PDF to DOCX using pdf2docx
            logger.info(f"Converting PDF ({len(pdf_bytes)} bytes)")
            cv = Converter(pdf_path)
            cv.convert(docx_path, start=0, end=None)
            cv.close()
            logger.info("Conversion completed")

            # Read the converted DOCX
            with open(docx_path, 'rb') as f:
                docx_bytes = f.read()

            # Encode to base64
            docx_base64 = base64.b64encode(docx_bytes).decode('utf-8')

            return jsonify({
                'docx': docx_base64,
                'metadata': {
                    'docxSize': len(docx_bytes),
                    'pdfSize': len(pdf_bytes)
                }
            }), 200

        except Exception as e:
            logger.error(f"Conversion error: {str(e)}")
            return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

        finally:
            # Clean up temporary files
            try:
                os.unlink(pdf_path)
                os.unlink(docx_path)
            except:
                pass

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
