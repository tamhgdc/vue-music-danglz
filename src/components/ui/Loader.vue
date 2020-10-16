<template>
    <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="-2 0 43 40" :stroke="color" :class="extraClass">
        <g fill="none" fill-rule="evenodd">
            <g transform="translate(1 1)" :stroke-width="strong ? '4' : '2'">
                <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(132.608 18 18)">
                    <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                </path>
            </g>
        </g>
    </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class Loader extends Vue {
    @Prop(String) readonly color!: string
    @Prop(String) readonly size!: string
    @Prop({ default: '' }) readonly extraClass!: string
    @Prop(Boolean) readonly strong?: boolean
}
</script>

<style lang="stylus" scoped>
svg
    transition 200ms ease-in-out
</style>
