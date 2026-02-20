# Composable Design Patterns

> Guidelines for creating robust, maintainable, and testable Vue composables in Rimelight projects.

## 1. Argument Passing

### Rule: Use Object Arguments for Four or More Parameters

To improve readability and maintainability, use an object for configuration when a composable (or its methods) requires four or more parameters.

```typescript
// Good: For Multiple Parameters
useUserData({ id: 1, fetchOnMount: true, token: "abc", locale: "en" });

// Also Good: For Fewer Parameters
useCounter(1, true, "session");

// Bad
useUserData(1, true, "abc", "en");
```

## 2. Error Handling

### Rule: Expose Error State

Composables should manage their own error state and expose it to the caller. Avoid silent failures or just logging to the console.

```typescript
// Good
export function useFeature() {
  const error = ref<Error | null>(null);

  const execute = async () => {
    try {
      // ... logic
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
    }
  };

  return { error, execute };
}
```

## 3. UI Decoupling

### Rule: Decouple UI from Business Logic

Composables should focus on state and logic. Avoid UI-specific side effects like toasts, alerts, or direct window manipulations (unless that's the sole purpose of the composable).

```typescript
// Good
// Component handles the UI feedback
const { error } = useUserData(userId);
watch(error, (err) => {
  if (err) showToast(err.message);
});

// Bad
// Composable is coupled to a specific UI framework/component
export function useUserData(userId) {
  const fetchUser = async () => {
    try {
      /*...*/
    } catch (e) {
      showToast("An error occurred."); // couples logic to UI
    }
  };
}
```

## 4. Anatomy of a Composable

### Rule: Consistent Internal Structure

Structure your composables for predictability:

1.  **Primary State**: The main reactive data.
2.  **State Metadata (Supportive State)**: Status (idle, loading, success, error), timestamps, etc.
3.  **Methods**: Functions that manipulate state or perform actions.

```typescript
export function useFeature() {
  // Primary State
  const data = ref(null);

  // Supportive State
  const status = ref("idle");
  const error = ref(null);

  // Methods
  const fetch = async () => {
    /*...*/
  };

  return { data, status, error, fetch };
}
```

## 5. Functional Core, Imperative Shell (Optional)

### Rule: Separate Pure Logic from Vue Reactivity

Keep complex logic in pure functions (Functional Core) and use the composable as the reactive wrapper (Imperative Shell).

```typescript
// Functional Core (pure function)
const calculateTotal = (items) => items.reduce((a, b) => a + b, 0);

// Imperative Shell (composable)
export function useCart() {
  const items = ref([]);
  const total = computed(() => calculateTotal(items.value));
  return { items, total };
}
```

## 6. Single Responsibility Principle (SRP)

### Rule: One Composable, One Responsibility

Each composable should handle one specific task or domain. If a composable is doing too much, split it.

```typescript
// Bad: Mixing concerns
export function useUserAndCounter() { ... }

// Good: Separate composables
export function useUser() { ... }
export function useCounter() { ... }
```

## 7. Consistent Feature Ordering

### Rule: Standardize the Order of Composition API Features

Maintain a consistent order within the `setup` or composable function:

1.  **Initializing**: External dependencies (inject, useRoute, etc.)
2.  **Refs/Reactive**: Local state
3.  **Computed**: Derived state
4.  **Methods**: Logic and actions
5.  **Lifecycle Hooks**: onMounted, etc.
6.  **Watchers**: Side effects

```typescript
export function useFeature() {
  // 1. Initializing
  const router = useRouter();

  // 2. Refs
  const count = ref(0);

  // 3. Computed
  const double = computed(() => count.value * 2);

  // 4. Methods
  const increment = () => count.value++;

  // 5. Lifecycle
  onMounted(() => console.log("Mounted"));

  // 6. Watch
  watch(count, () => console.log("Changed"));

  return { count, double, increment };
}
```
