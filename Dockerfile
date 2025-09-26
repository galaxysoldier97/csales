# Utiliza una imagen oficial de Node.js como imagen base
FROM node:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install


# Copia el resto del código de la aplicación al directorio de trabajo
COPY . .

# Construye el proyecto Vue (comenta esta línea si estás desarrollando localmente)
# RUN npm run build

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Define el comando para iniciar la aplicación
ENTRYPOINT ["npm", "run", "dev"]
