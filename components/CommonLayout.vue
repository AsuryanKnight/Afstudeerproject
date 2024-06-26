
<template>
  <div>
    <Header />
    <div class="container mx-auto mt-4">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommonLayout'
}
</script>
