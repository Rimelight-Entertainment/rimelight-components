<script setup lang="ts">
useHead({
  title: "Home"
})
</script>

<template>
  <UPage>
    <UContainer>
      <RCSection :level="1" title="Components" description="Lorem ipsum dolor sit amet.">
        <RCSection :level="2" title="Content" description="Lorem ipsum dolor sit amet.">
          <RCSection
            :level="3"
            title="Callout"
            description="Callouts are used to highlight important information."
          >
            <div class="flex flex-col gap-md">
              <RCCallout variant="info"> Lorem ipsum dolor sit amet. </RCCallout>
              <RCCallout variant="success">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="warning">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="error">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="commentary">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="ideation">Lorem ipsum dolor sit amet.</RCCallout>
              <RCCallout variant="source">Lorem ipsum dolor sit amet.</RCCallout>
            </div>
          </RCSection>
        </RCSection>
        <RCSection :level="2" title="App" description="App-level components.">
          <RCSection
            :level="3"
            title="Logo"
            description="Logos are used to represent the brand."
          >
            <div class="flex flex-row items-center gap-md bg-black p-md text-white border border-white/10">
              <RCLogo variant="mark" class="h-12 w-auto" />
              <RCLogo variant="type" class="h-12 w-auto" />
              <RCLogo variant="symbol" class="h-12 w-auto" />
              <UIcon name="lucide:check" class="h-12 w-auto" />
            </div>
            <div class="mt-md flex flex-row items-center gap-md bg-white p-md text-black border border-black/10">
              <RCLogo variant="mark" class="h-12 w-auto" mode="light" />
              <RCLogo variant="type" class="h-12 w-auto" mode="light" />
              <UIcon name="lucide:check" class="h-12 w-auto" />
            </div>
          </RCSection>
        </RCSection>
        <RCSection :level="2" title="Swatches" description="Lorem ipsum dolor sit amet.">
          <RCSection :level="3" title="Logotype">
            <div class="flex flex-col gap-lg lg:flex-row">
              <RCImageSwatch
                name="Monochrome White"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
              <RCImageSwatch
                name="Monochrome Black"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
              <RCImageSwatch
                name="Color"
                jpg="https://cdn.idantity.me/images/logos/logomark-white.webp"
                png="https://cdn.idantity.me/images/logos/logomark-white.webp"
                webp="https://cdn.idantity.me/images/logos/logomark-white.webp"
                svg="https://cdn.idantity.me/images/logos/logomark-white.webp"
              />
            </div>
          </RCSection>
          <RCSection :level="3" title="Color" description="Lorem ipsum dolor sit amet.">
            <RCColorSwatch
              name="Color"
              hex="#1d6ebe"
              rgb="rgb(29, 110, 190)"
              hsl="hsl(209 73% 43%)"
              oklch="oklch(0.5338 0.1455 252.53)"
              cmyk="cmyk(84%, 42%, 0%, 25%)"
            />
          </RCSection>
          <RCSection :level="3" title="Image" description="Lorem ipsum dolor sit amet.">
            <RCImageSwatch
              name="Image"
              jpg="https://placehold.co/1024x512"
              png="https://placehold.co/1024x512"
              webp="https://placehold.co/1024x512"
              svg="https://placehold.co/1024x512"
            />
          </RCSection>
          <RCSection :level="3" title="Font" description="Lorem ipsum dolor sit amet.">
            <RCFontSwatch />
          </RCSection>
        </RCSection>
      </RCSection>
    </UContainer>
  </UPage>
</template>

<style scoped></style>
