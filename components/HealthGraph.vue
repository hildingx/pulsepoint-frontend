<template>
  <svg ref="svgRef" :width="width" :height="height"></svg>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import * as d3 from "d3";
import type { HealthEntry } from "@/types/healthEntry";

const props = defineProps<{
  entries: HealthEntry[];
  valueKey: keyof HealthEntry; // t.ex. "mood", "sleep", osv
  title: string;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const width = 400;
const height = 200;

const drawGraph = () => {
  if (!svgRef.value || props.entries.length === 0) return;

  const svg = d3.select(svgRef.value);
  svg.selectAll("*").remove(); // Rensa tidigare grafik

  const data = props.entries.map((entry) => ({
    date: new Date(entry.date),
    value: entry[props.valueKey] as number,
  }));

  // Skala för x (datum)
  const x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.date) as [Date, Date])
    .range([40, width - 20]);

  // Skala för y (1–5)
  const y = d3
    .scaleLinear()
    .domain([1, 5])
    .range([height - 30, 10]);

  // Linjefunktion
  const line = d3
    .line<{ date: Date; value: number }>()
    .x((d) => x(d.date))
    .y((d) => y(d.value));

  // Rita x-axel
  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 30})`)
    .call(d3.axisBottom(x).ticks(5));

  // Rita y-axel
  svg
    .append("g")
    .attr("transform", `translate(40, 0)`)
    .call(d3.axisLeft(y).ticks(5));

  // Rita linje
  svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#007acc")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Titel
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text(props.title);
};

// Rita om när entries ändras
watch(() => props.entries, drawGraph, { deep: true });
onMounted(drawGraph);
</script>
