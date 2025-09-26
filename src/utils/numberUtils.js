/**
 * Formatea un número a un string con dos decimales.
 * Asegura que incluso los números negativos se formateen correctamente.
 * @param {Number} amount El monto a formatear.
 * @return {String} El monto formateado como string.
 */
export function formatAmount(amount) {
    // Intenta convertir el valor a float.
    const number = parseFloat(amount);
    
    // Verifica si el resultado es un número válido. Si no, devuelve "0.00".
    if (isNaN(number)) {
      return "0.00";
    }
    
    // Formatea el número válido a dos decimales y devuelve.
    return number.toFixed(2);
  }
  