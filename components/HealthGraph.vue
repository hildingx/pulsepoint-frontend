<template>
  <div ref="wrapperRef" class="graph-wrapper">
    <svg ref="svgRef" :width="width" :height="height"></svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue";
import * as d3 from "d3";
import type { HealthEntry } from "@/types/healthEntry";

const props = defineProps<{
  entries: HealthEntry[];
  valueKey: keyof HealthEntry;
  title: string;
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const wrapperRef = ref<HTMLDivElement | null>(null);
const width = ref(400);
const height = 200;

const drawGraph = () => {
  if (!svgRef.value || props.entries.length === 0) return;

  const data = props.entries.map((entry) => ({
    date: new Date(entry.date),
    value: entry[props.valueKey] as number,
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
    .curve(d3.curveMonotoneX); // mjukare kurvor

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - 30})`)
    .call(d3.axisBottom(x).ticks(5));

  svg
    .append("g")
    .attr("transform", `translate(40, 0)`)
    .call(d3.axisLeft(y).ticks(5));

  const path = svg
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#007acc")
    .attr("stroke-width", 2)
    .attr("d", line);

  // Animation: linjen ritas från vänster till höger
  const totalLength = (path.node() as SVGPathElement).getTotalLength();

  path
    .attr("stroke-dasharray", totalLength + " " + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);

  svg
    .append("text")
    .attr("x", width.value / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text(props.title);
};

// Justera bredd på mount
onMounted(() => {
  nextTick(() => {
    if (wrapperRef.value) {
      width.value = wrapperRef.value.clientWidth;
    }
    drawGraph();
  });
});

// Rita om när data ändras
watch(() => props.entries, drawGraph, { deep: true });
</script>

<style scoped>
.graph-wrapper {
  width: 100%;
}
</style>
