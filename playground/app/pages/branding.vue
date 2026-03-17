<script setup lang="ts">
const mainCss = import.meta.glob("../assets/css/main.css", {
  query: "?raw",
  import: "default",
  eager: true,
})["../assets/css/main.css"] as string;

useHead({
  title: "Branding",
});

useSeoMeta({
  title: "Branding",
  ogTitle: "Branding",
  description: "Branding guidelines and assets for Rimelight Components.",
});

/* region State */
/* endregion */

/* region Meta */
/* endregion */

/* region Lifecycle */
/* endregion */

/* region Logic */
/* endregion */
</script>

<template>
  <UContainer class="py-12">
    <UPage>
      <UPageBody>
        <RCSection
          :level="1"
          title="Branding"
          description="Guidelines and assets for Rimelight Components."
        >
          <RCSection
            :level="2"
            title="Logos"
            description="The Rimelight logo in its various forms."
          >
            <RCSection :level="4" title="Logotype">
              <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                <RCImageSwatch
                  name="Logomark - Color"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Color/JPEG/idantity.me%20-%20Logotype%20-%20Color.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Color/PNG/idantity.me%20-%20Logotype%20-%20Color.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Color/SVG/idantity.me%20-%20Logotype%20-%20Color.svg"
                />
                <RCImageSwatch
                  name="Logomark - Monochrome White"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20White/JPEG/idantity.me%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20White/PNG/idantity.me%20-%20Logotype%20-%20Monochrome%20White%20-%20Color%20Background.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20White/SVG/idantity.me%20-%20Logotype%20-%20Monochrome%20White.svg"
                />
                <RCImageSwatch
                  name="Logomark - Monochrome Black"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20Black/JPEG/idantity.me%20-%20Logotype%20-%20Monochrome%20Black%20-%20White%20Background.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20Black/PNG/idantity.me%20-%20Logotype%20-%20Monochrome%20Black%20-%20White%20Background.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logotype/Monochrome%20Black/SVG/idantity.me%20-%20Logotype%20-%20Monochrome%20Black.svg"
                />
              </div>
            </RCSection>

            <RCSection :level="4" title="Logomark">
              <div class="flex flex-col gap-lg lg:grid lg:grid-cols-4">
                <RCImageSwatch
                  name="Logomark - Color"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Color/JPEG/idantity.me%20-%20Logomark%20-%20Color.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Color/PNG/idantity.me%20-%20Logomark%20-%20Color.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Color/SVG/idantity.me%20-%20Logomark%20-%20Color.svg"
                />
                <RCImageSwatch
                  name="Logomark - Monochrome White"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20White/JPEG/idantity.me%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20White/PNG/idantity.me%20-%20Logomark%20-%20Monochrome%20White%20-%20Color%20Background.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20White/SVG/idantity.me%20-%20Logomark%20-%20Monochrome%20White.svg"
                />
                <RCImageSwatch
                  name="Logomark - Monochrome Black"
                  jpg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20Black/JPEG/idantity.me%20-%20Logomark%20-%20Monochrome%20Black%20-%20White%20Background.jpg"
                  png="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20Black/PNG/idantity.me%20-%20Logomark%20-%20Monochrome%20Black%20-%20White%20Background.png"
                  svg="https://cdn.idantity.me/Images/Branding/Logo/Logomark/Monochrome%20Black/SVG/idantity.me%20-%20Logomark%20-%20Monochrome%20Black.svg"
                />
              </div>
            </RCSection>
          </RCSection>

          <RCSection
            :level="2"
            title="Colors"
            description="The color palette used across our branding."
          >
            <RCColorPalette :css="mainCss" />
          </RCSection>

          <RCSection
            :level="2"
            title="Typography"
            description="The font families and styles used in our branding."
          >
            <RCFontPalette :css="mainCss" />
          </RCSection>
        </RCSection>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
