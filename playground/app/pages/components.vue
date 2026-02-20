<script setup lang="ts">
useHead({
  title: "Components",
});
</script>

<template>
  <UPage>
    <UContainer>
      <RCSection :level="1" title="Components" description="Full list of Rimelight Components.">
        <RCSection :level="2" title="Content" description="Standard content elements.">
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

        <!-- Dynamic sections can be added here -->
      </RCSection>
    </UContainer>
  </UPage>
</template>

<style scoped></style>
