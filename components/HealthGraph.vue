<template>
  <div class="rounded-xl bg-white shadow-sm p-4">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ title }}</h3>
    <div ref="wrapperRef" class="graph-wrapper">
      <svg ref="svgRef" :width="width" :height="height"></svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick, onBeforeUnmount } from "vue";
import * as d3 from "d3";
import type { HealthEntry } from "@/types/healthEntry";

// Tillåt endast specifika nycklar från HealthEntry
type HealthMetricKey = "mood" | "sleep" | "stress" | "activity" | "nutrition";

// Props
const props = defineProps<{
  entries: HealthEntry[];
  valueKey: HealthMetricKey;
  title: string;
}>();

// Referenser och dimensioner
const svgRef = ref<SVGSVGElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const width = ref(400);
const height = 200;

/**
 * Ritar grafen i SVG med D3
 */
const drawGraph = () => {
  if (!svgRef.value || props.entries.length === 0) return;

  interface EntryWithCount extends HealthEntry {
    entryCount?: number; // gör den optional
  }

  const data = (props.entries as EntryWithCount[]).map((entry) => ({
    date: new Date(entry.date),
    value: entry[props.valueKey] as number,
    count: entry.entryCount ?? 0,
  }));

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove();

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date) as [Date, Date])
    .range([40, width.value - 20]);

  const y = d3
    .scaleLinear()
    .domain([1, 5])
    .range([height - 30, 10]);

  const line = d3
    .line<{ date: Date; value: number }>()
    .x((d) => x(d.date))
    .y((d) => y(d.value))
    .curve(d3.curveMonotoneX); // Mjukare kurva

  // Axlar
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 30})`)
    .call(d3.axisBottom(x).ticks(5));

  svg
    .append("g")
    .attr("transform", `translate(40, 0)`)
    .call(d3.axisLeft(y).ticks(5));

  // Linje
  const path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#007acc")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Animerad inritning
  const totalLength = (path.node() as SVGPathElement).getTotalLength();

  path
    .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  // Visa datapunkter med storlek/tooltip endast om entryCount finns (för managers)
  if (data.some((d) => typeof d.count === "number" && d.count > 0)) {
    const maxCount = d3.max(data, (d) => d.count) ?? 1;

    const rScale = d3.scaleLinear().domain([1, maxCount]).range([2, 8]);

    const formatDate = d3.timeFormat("%Y-%m-%d");

    // Skapa cirklar för varje datapunkt
    // Storleken beror på hur många som svarat (entryCount)
    // Låg svarsfrekvens (< 5) gör punkten halvtransparent
    // Tooltip visar antal svar vid hovring
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.date))
      .attr("cy", (d) => y(d.value))
      .attr("r", (d) => rScale(d.count))
      .attr("fill", "#007acc")
      .attr("opacity", (d) => (d.count < 5 ? 0.5 : 1))
      .append("title")
      .text(
        (d) =>
          `Datum: ${formatDate(d.date)}\nVärde: ${d.value}\nSvar: ${d.count}`
      );
  }
};

// Sätt grafbredd när komponenten mountas
const resizeAndDraw = () => {
  nextTick(() => {
    if (wrapperRef.value) {
      width.value = wrapperRef.value.clientWidth;
    }
    drawGraph();
  });
};

// Kör när komponenten laddas
onMounted(() => {
  resizeAndDraw();
  window.addEventListener("resize", resizeAndDraw);
});

// Ta bort resize-listener
onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeAndDraw);
});

// Rita om när datan ändras
watch(() => props.entries, drawGraph, { deep: true });
</script>

<style scoped>
.graph-wrapper {
  width: 100%;
}
</style>
