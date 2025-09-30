# 📝 Guía para Crear Usuarios Manualmente

## ✅ **El sistema SÍ funciona correctamente**

Los usuarios creados desde la interfaz web (`add-user.html`) funcionan perfectamente para el login. El problema es que estás intentando crear usuarios con datos que ya existen.

## ❌ **Errores Comunes al Crear Usuarios**

### 1. **Email ya existe**
```
❌ Error: Email already registered
```
**Solución:** Usa un email diferente que termine en `@ucol.mx`

### 2. **Matrícula ya existe**
```
❌ Error: Student ID already registered
```
**Solución:** Usa una matrícula diferente (números únicos)

## 📋 **Datos que YA están en uso**

### **Emails ocupados:**
- `daceves0@ucol.mx`
- `prueba@ucol.mx`
- `admin@ucol.mx`
- `juan.perez@ucol.mx`
- `maria.garcia@ucol.mx`
- `carlos.lopez@ucol.mx`
- `ana.martinez@ucol.mx`
- `web.test@ucol.mx`

### **Matrículas ocupadas:**
- `20195865`
- `2024999`
- `2024001`
- `2024002`
- `2024003`
- `2024998`

## ✅ **Cómo crear usuarios correctamente**

### **Opción 1: Interfaz Web (Recomendado)**
1. Ve a: `http://localhost:5000/add-user.html`
2. Usa emails únicos como:
   - `tu.nombre@ucol.mx`
   - `estudiante.nuevo@ucol.mx`
   - `profesor.nuevo@ucol.mx`
3. Usa matrículas únicas como:
   - `2024004`, `2024005`, `2024006`, etc.

### **Opción 2: Script de Comandos**
```bash
node scripts/addUser.js
```

### **Opción 3: Usuarios de Ejemplo**
```bash
npm run seed-users
```

## 🧪 **Usuario de Prueba Funcional**

Si quieres probar el login inmediatamente, usa este usuario que ya funciona:

- **Email:** `web.test@ucol.mx`
- **Contraseña:** `web123456`
- **Rol:** Estudiante
- **Matrícula:** `2024998`
- **Facultad:** Telemática

## 🔧 **Si sigues teniendo problemas**

1. **Verifica que el servidor esté corriendo:**
   ```bash
   npm start
   ```

2. **Revisa los usuarios existentes:**
   ```bash
   node scripts/debugUsers.js
   ```

3. **Resetea la base de datos si es necesario:**
   ```bash
   node scripts/resetDatabase.js
   npm run seed-users
   ```

## 📊 **Resumen**

- ✅ **La interfaz web funciona perfectamente**
- ✅ **El login funciona correctamente**
- ✅ **La encriptación de contraseñas funciona**
- ❌ **El problema es usar datos duplicados**

**Solución:** Usa emails y matrículas únicos al crear usuarios.
