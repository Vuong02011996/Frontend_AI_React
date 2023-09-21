import React, { useState, useEffect, useRef } from 'react';
import { Layer, Circle, Line } from 'react-konva';
import PropTypes from 'prop-types';
import { Helper } from '@/utils';

const DEFAULTS = {
    fill: '#4DA3A9',
    width: 10,
    height: 10,
};
export default function LayerComponent({ width, height, coordinates, onChangeLayer, isDraw }) {
    const [blue1Node, updateBlue1Node] = useState({
        x: 10,
        y: 10,
        ...DEFAULTS,
    });
    const [blue2Node, updateBlue2Node] = useState({
        x: 10,
        y: 200,
        ...DEFAULTS,
    });
    const [blue3Node, updateBlue3Node] = useState({
        x: 300,
        y: 10,
        ...DEFAULTS,
    });
    const [blue4Node, updateBlue4Node] = useState({
        x: 300,
        y: 200,
        ...DEFAULTS,
    });

    const firstTimeRender = useRef(true);

    useEffect(() => {
        if (width && height) {
            updateBlue1Node({
                ...blue1Node,
                x: coordinates[0][0] * width,
                y: coordinates[0][1] * height,
            });
            updateBlue2Node({
                ...blue1Node,
                x: coordinates[1][0] * width,
                y: coordinates[1][1] * height,
            });
            updateBlue3Node({
                ...blue1Node,
                x: coordinates[2][0] * width,
                y: coordinates[2][1] * height,
            });
            updateBlue4Node({
                ...blue1Node,
                x: coordinates[3][0] * width,
                y: coordinates[3][1] * height,
            });
        }
    }, [width, height]);

    const formatPercenToFixed = (number) => Number(parseFloat(number / 100).toFixed(2));

    useEffect(() => {
        if (blue1Node && blue2Node && blue3Node && blue4Node && !firstTimeRender.current) {
            onChangeLayer([
                [
                    formatPercenToFixed(Helper.percentage(blue1Node.x, width)),
                    formatPercenToFixed(Helper.percentage(blue1Node.y, height)),
                ],
                [
                    formatPercenToFixed(Helper.percentage(blue2Node.x, width)),
                    formatPercenToFixed(Helper.percentage(blue2Node.y, height)),
                ],
                [
                    formatPercenToFixed(Helper.percentage(blue3Node.x, width)),
                    formatPercenToFixed(Helper.percentage(blue3Node.y, height)),
                ],
                [
                    formatPercenToFixed(Helper.percentage(blue4Node.x, width)),
                    formatPercenToFixed(Helper.percentage(blue4Node.y, height)),
                ],
            ]);
        }
    }, [blue1Node, blue2Node, blue3Node, blue4Node]);

    useEffect(() => {
        firstTimeRender.current = false;
    }, []);

    return (
        <Layer>
            <Line
                x={0}
                y={0}
                points={[
                    blue1Node.x,
                    blue1Node.y,
                    blue2Node.x,
                    blue2Node.y,
                    blue4Node.x,
                    blue4Node.y,
                    blue3Node.x,
                    blue3Node.y,
                ]}
                fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                closed
                fill="rgba(77, 163, 169, 0.6)"
            />
            <Circle
                {...blue1Node}
                onDragMove={(e) => {
                    const { x, y } = e.target.position();
                    if (x >= 10 && x <= width - 5 && y >= 10 && y <= height - 5) {
                        updateBlue1Node({ ...blue1Node, ...e.target.position() });
                    }
                }}
                draggable={isDraw}
            />
            <Circle
                {...blue2Node}
                onDragMove={(e) => {
                    const { x, y } = e.target.position();
                    if (x >= 10 && x <= width - 5 && y >= 10 && y <= height - 5) {
                        updateBlue2Node({ ...blue2Node, ...e.target.position() });
                    }
                }}
                draggable={isDraw}
            />
            <Circle
                {...blue3Node}
                onDragMove={(e) => {
                    const { x, y } = e.target.position();
                    if (x >= 10 && x <= width && y >= 10 && y <= height) {
                        updateBlue3Node({ ...blue2Node, ...e.target.position() });
                    }
                }}
                draggable={isDraw}
            />
            <Circle
                {...blue4Node}
                onDragMove={(e) => {
                    const { x, y } = e.target.position();
                    if (x >= 10 && x <= width && y >= 10 && y <= height) {
                        updateBlue4Node({ ...blue2Node, ...e.target.position() });
                    }
                }}
                draggable={isDraw}
            />
        </Layer>
    );
}

LayerComponent.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    coordinates: PropTypes.arrayOf(PropTypes.any),
    onChangeLayer: PropTypes.func,
    isDraw: PropTypes.bool,
};

LayerComponent.defaultProps = {
    width: 0,
    height: 0,
    coordinates: [],
    onChangeLayer: () => {},
    isDraw: false,
};
