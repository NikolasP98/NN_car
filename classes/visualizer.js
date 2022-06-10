import { lerp, getRGBA } from './utils';
import { ellipse, rect } from './shapes';

export default class Visualizer {
	static drawNetwork(ctx, network) {
		const margin = 50;
		const left = margin;
		const top = margin;
		const width = ctx.canvas.width - margin * 2;
		const height = ctx.canvas.height - margin * 2;

		const levelHeight = height / network.levels.length;

		for (let i = network.levels.length - 1; i >= 0; i--) {
			const levelTop =
				top +
				lerp(
					height - levelHeight,
					0,
					network.levels.length == 1
						? 0.5
						: i / (network.levels.length - 1)
				);

			ctx.setLineDash([7, 3]);

			Visualizer.drawLevel(
				ctx,
				network.levels[i],
				left,
				levelTop,
				width,
				levelHeight,
				i == network.levels.length - 1 ? ['🠝', '🠜', '🠞', '🠟'] : []
			);
		}

		// Visualizer.drawLevel(ctx, network.levels[0], left, top, width, height);
	}

	static drawLevel(ctx, level, left, top, width, height, outputLabels) {
		const right = left + width;
		const bottom = top + height;

		const { inputs, outputs, weights, biases } = level;

		const nodeRadius = 18;

		for (let i = 0; i < inputs.length; i++) {
			for (let j = 0; j < outputs.length; j++) {
				ctx.beginPath();
				ctx.moveTo(
					Visualizer.#getNodeX(inputs, i, left, right),
					bottom
				);
				ctx.lineTo(Visualizer.#getNodeX(outputs, j, left, right), top);

				ctx.strokeStyle = getRGBA(weights[i][j]);
				ctx.lineWidth = 2;
				ctx.stroke();
			}
		}

		ctx.lineWidth = 2;

		for (let i = 0; i < inputs.length; i++) {
			const x = Visualizer.#getNodeX(inputs, i, left, right);
			ctx.strokeStyle = 'transparent';

			ctx.fillStyle = '#000';
			ellipse({ ctx, x, y: bottom, radius: nodeRadius });
			ctx.fillStyle = getRGBA(inputs[i]);
			ellipse({ ctx, x, y: bottom, radius: nodeRadius * 0.6 });

			// ctx.fillStyle = 'transparent';
			// ctx.strokeStyle = getRGBA(biases[i]);
			// ellipse({ ctx, x, y: bottom, radius: nodeRadius * 0.8 });
		}

		for (let i = 0; i < outputs.length; i++) {
			const x = Visualizer.#getNodeX(outputs, i, left, right);

			ctx.strokeStyle = 'transparent';
			ctx.fillStyle = '#000';
			ellipse({ ctx, x, y: top, radius: nodeRadius });
			ctx.fillStyle = getRGBA(outputs[i]);
			ellipse({ ctx, x, y: top, radius: nodeRadius * 0.6 });

			ctx.fillStyle = 'transparent';
			ctx.strokeStyle = getRGBA(biases[i]);
			ctx.setLineDash([3, 3]);
			ellipse({ ctx, x, y: top, radius: nodeRadius * 0.8 });
			ctx.setLineDash([]);

			if (outputLabels && outputLabels[i]) {
				ctx.beginPath();
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillStyle = '#000';
				ctx.strokeStyle = '#fff';
				ctx.font = `${nodeRadius * 1}px Arial`;
				ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
				ctx.lineWidth = 0.5;
				ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
			}
		}
	}

	static #getNodeX(nodes, index, left, right) {
		return lerp(
			left,
			right,
			nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
		);
	}
}
