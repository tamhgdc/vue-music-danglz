<template>
  <div class="input-wrapper" :class="{ 'input-focused': focused }">
    <Loader
      v-if="isLoading"
      size="16px" extraClass="loader"
      :color="colorLoadingIcon"
      :strong="true"
    />
    <i v-else class="fa fa-search"></i>
    <input
      type="text"
      :placeholder="placeholder"
      @focus="focused = true"
      @blur="focused = false"
      @keypress="onKeyPress"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Loader from '@/components/ui/Loader.vue'

@Component({
  components: {
    Loader
  }
})
export default class Input extends Vue {
  @Prop({ default: '' }) readonly placeholder?: string
  @Prop({ default: '' }) readonly value?: string
  @Prop(Boolean) readonly isLoading?: boolean
  @Prop({ default: (_: KeyboardEvent) => _ }) readonly onKeyPress?: Function

  private focused = false

  get colorLoadingIcon () {
    return this.focused ? '#ad86e2' : '#C0C0C0'
  }
}
</script>
<style lang="stylus" scoped>
.input-wrapper
  background white
  width 100%
  border-radius 10px
  border 1px solid #E3E3E3
  padding 5px 30px
  display flex
  align-items center
  transition 200ms ease-in-out
  box-sizing border-box
  margin-bottom 1rem

  &.input-focused
    border 1px solid #ad86e2
    i
      color #ad86e2

  i
    margin-right 15px
    color #C0C0C0
    transition 200ms ease-in-out

  .loader
    margin-right 15px

  input
    width 100%
    height 50px
    border none
    font-family 'Montserrat'
    font-weight normal
    color #434343
    text-transform uppercase
    outline none
    // font-size 1rem

    &::placeholder
      color #C0C0C0
</style>
