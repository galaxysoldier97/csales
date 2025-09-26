<template>
    <div class="w-full"> 
        <div class="w-full">
            <InputGroup> 
                <InputText placeholder="Cédula o Pasaporte" />
                <Button label="Buscar" size="small" rounded />
            </InputGroup>
            
            <div class="mt-4">
                <h1 class="text-lg font-semibold text-gray-700"><i class="pi pi-home"></i> Servicio Fijo del Match Digital</h1>
                <ul class="mt-4 p-2">
                    <li>
                        <input type="radio" id="cuenta1" name="cuenta" value="cuenta1">
                        <label class="ml-3" for="cuenta1">Cuenta 9889898 - Panama, Juan Diaz (direcciones)</label>
                    </li> 
                </ul>
            </div>
        </div> 
    </div>
</template>


<script>
export default {
    data() {
        return {
            searchQuery: ''
        };
    },
    methods: {
        search() {
            // Perform search logic here
            // You can access the search query using this.searchQuery
        }
    }
}
</script>
 