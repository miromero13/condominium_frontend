#!/bin/bash

# Script de despliegue para el frontend React en AWS S3 + CloudFront

echo "🚀 Iniciando despliegue del frontend..."

# Verificar si AWS CLI está configurado
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI no está configurado. Configura primero con 'aws configure'"
    exit 1
fi

# Variables (personaliza estos valores)
BUCKET_NAME="condominium-frontend-production"
DISTRIBUTION_ID=""  # Se creará después
DOMAIN_NAME="tudominio.com"

# Crear archivo .env.production si no existe
if [ ! -f ".env.production" ]; then
    echo "📝 Creando archivo .env.production..."
    cat > .env.production << EOL
VITE_API_URL=https://tu-backend.elasticbeanstalk.com
VITE_APP_TITLE=SmartCondo
EOL
    echo "✅ Archivo .env.production creado. EDÍTALO con la URL real de tu backend."
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

echo "🔨 Construyendo aplicación para producción..."
npm run build

echo "☁️ Preparando bucket S3..."

# Crear bucket S3 si no existe
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "📁 Creando bucket S3: $BUCKET_NAME"
    aws s3 mb "s3://$BUCKET_NAME"
    
    # Configurar bucket para hosting web estático
    aws s3 website "s3://$BUCKET_NAME" \
        --index-document index.html \
        --error-document index.html
        
    # Configurar política del bucket
    cat > bucket-policy.json << EOL
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOL
    
    aws s3api put-bucket-policy \
        --bucket "$BUCKET_NAME" \
        --policy file://bucket-policy.json
        
    rm bucket-policy.json
fi

echo "🚀 Subiendo archivos a S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete

echo "✅ Frontend desplegado en S3"
echo "🌐 URL del sitio web: http://$BUCKET_NAME.s3-website-us-east-1.amazonaws.com"
echo ""
echo "📋 Próximos pasos para CloudFront:"
echo "   1. Crea una distribución de CloudFront"
echo "   2. Configura tu dominio en Route 53 o Namecheap"
echo "   3. Agrega certificado SSL"