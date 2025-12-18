```typescript
selectedValue = signal('apple');

valueItems = computed(() => [
  {
    label: 'Fruits',
    icon: 'apple',
    children: [
      { label: 'Apple', value: 'apple', icon: 'circle' },
      { label: 'Banana', value: 'banana', icon: 'circle' },
      { label: 'Orange', value: 'orange', icon: 'circle' },
    ],
  },
  {
    label: 'Vegetables',
    icon: 'leaf',
    children: [
      { label: 'Carrot', value: 'carrot', icon: 'circle' },
      { label: 'Broccoli', value: 'broccoli', icon: 'circle' },
      { label: 'Tomato', value: 'tomato', icon: 'circle' },
    ],
  },
  { label: 'Water', value: 'water', icon: 'droplet' },
  { label: 'Juice', value: 'juice', icon: 'cup-soda' },
]);
```
