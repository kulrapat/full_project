<template>
    <div class="q-gutter-md" style="max-width:400px">
        <q-form 
        @submit="onSubmit"
        class="q-gutter-md"
        >
            <q-input v-model="UserName" label="UserName" />
            <q-input v-model="UserID" label="UserID" />
            <q-input v-model="Password" label="Password" />
            <q-input v-model="Status" label="Status" />
            <q-input v-model="Role" label="Role" />
            <q-btn type="submit" label="Submit" color="primary" />
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const UserName = ref('')
const UserID = ref('')
const Password = ref('')
const Status = ref('')
const Role = ref('')

const onSubmit = () =>{
const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
    "UserName": UserName.value,
    "UserID": Number(UserID.value),
    "Password": Password.value,
    "Status": Status.value,
    "Role": Role.value,
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
    };

    fetch("http://localhost:8800/api/v1/users", requestOptions)
    .then((response) => response.json())
    .then((result) => {
        alert(result.message)
        if (result.status === "success") {
            router.push('/user')
        }
    })
    .catch((error) => console.error(error)); 
}

</script>

