<template>
    <div class="q-gutter-md" style="max-width:400px">
        <q-form 
        @submit="onSubmit"
        class="q-gutter-md"
        >
            <q-input v-model="UserName" label="UsernName" />
            <q-input v-model="Password" label="Password" />
            <q-input v-model="Status" label="Status" />
            <q-input v-model="Role" label="Role" />
            <q-btn type="submit" label="Submit" color="primary" />
        </q-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const id = ref(route.params.id)
const UserName = ref('')
const Password = ref('')
const Status = ref('')
const Role = ref('')


const fetchData = () => {
    fetch("http://localhost:8800/api/v1/users/" + id.value)
    .then(res => res.json())
    .then(result => {
        UserName.value = result.UserName
        Password.value = result.Password
        Status.value = result.Status
        Role.value = result.Role
    })
}

fetchData()

const onSubmit = () =>{
const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
    "UserName": UserName.value,
    "Password": Password.value,
    "Status": Status.value,
    "Role": Role.value,
    });

const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
};

fetch("http://localhost:8800/api/v1/users/"+ id.value, requestOptions)
    .then((response) => {
        if (!response.ok) {
            return response.json().then((error) => {
                throw new Error(error.message || 'Something went wrong!');
            });
        }
        return response.json();
    })
    .then((result) => {
        alert(result.message)
        console.log(result)
        if (result.status === "success") {
            router.push('/user')
        }
        fetchData()
    })
    .catch((error) => {
        console.error('error',error);
        alert(`Error: ${error.message}`);
    });

}
</script>