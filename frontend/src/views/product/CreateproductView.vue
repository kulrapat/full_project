<template>
    <div class="q-gutter-md" style="max-width:400px">
        <q-form 
        @submit="onSubmit"
        class="q-gutter-md"
        >
            <q-input v-model="product_id" label="Product ID" />
            <q-input v-model="name" label="Name" />
            <q-input v-model="description" label="Description" />
            <q-input v-model="price" label="Price" />
            <q-input v-model="category" label="Category" />
            <q-input v-model="image_url" label="Image_url" />
            <q-btn type="submit" label="Submit" color="primary" />
        </q-form>
    </div>
</template>ฃ

<script setup>
import { ref } from 'vue'

const product_id = ref('')
const name = ref('')
const description = ref('')
const price = ref('')
const category = ref('')
const image_url = ref('')

const fetchData = () => {
    fetch("http://localhost:8800/api/v1/products/" + id.value)
    .then(res => res.json())
    .then(result => {
        name.value = result.name
        description.value = result.description
        price.value = result.price
        category.value = result.category
        image_url.value = result.image_url
    })
}
fetchData()

const onSubmit = () =>{
const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
    product_id: Number(product_id.value),   
    "name": name.value,
    "description": description.value,
    price: parseFloat(price.value),
    "category": category.value,
    "image_url": image_url.value
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://localhost:8800/api/v1/products", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        alert(result.message)
        if (result.status === "success") {
            router.push('/product')
        }
    })
    .catch((error) => console.error(error)); 
}

</script>

