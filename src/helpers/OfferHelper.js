// Objetivo: Funciones de ayuda para el manejo de ofertas

export const data_type_offer = [
    {
      name: 'Fijo',
      code: 'Fijo',
      services: [
        { cname: 'Venta Fijo', code: 'VentaFijo' , id: 1},
        { cname: 'VAS Fijo', code: 'VASFijo', id: 2},
        { cname: 'Retención Fijo', code: 'RetencionFijo', id: 5}, 
      ]
    },
    {
      name: 'Movil',
      code: 'Movil',
      services: [
        { cname: 'Venta Movil', code: 'VentaMovil' , id: 4}, 
        { cname: 'VAS Movil', code: 'VASMovil' , id: 3},
      ]
    }, 
    {
      name: 'Convergente',
      code: 'Convergente',
      services: [
        { cname: 'Movil + Benificio Fijo', code: 'ConvergenteMovilplusFijo' , id: 6},
        { cname: 'Fijo + Descuento Movil', code: 'ConvergenteFijoplusMovil' , id: 7},
        { cname: 'Fijo + Movil', code: 'ConvergenteFijoMovil' , id: 8},
      ]
    }
  ];
   
  
  export function fn_groupContracts(data) {
 
    const groupChildProducts = (childProducts) => {
      const grouped = {};
      childProducts.forEach(child => {
        const key = child.name;
        if (!grouped[key]) {
          grouped[key] = {
            ...child,
            cantidad: 0,
            showSublist: false,
            childProducts: []
          };
        }
        grouped[key].cantidad += 1;
        if (child.childProducts && child.childProducts.length > 0) {
          grouped[key].childProducts = groupChildProducts([...grouped[key].childProducts, ...child.childProducts]);
        }
      });
      return Object.values(grouped);
    };

    const groupedData = data.map(item => {
      item.showSublist = false;
      if (item.childProducts && item.childProducts.length > 0) {
        item.childProducts = groupChildProducts(item.childProducts);
      }
      return item;
    });

    return groupedData;
  }
   
       