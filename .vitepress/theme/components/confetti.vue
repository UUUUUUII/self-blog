<script setup lang="ts">
import { onMounted } from "vue";
import confetti from "canvas-confetti";
const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};
onMounted(() =>
  confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 },
  })
);
</script>