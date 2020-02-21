import React from 'react';
import { Dialog, DialogActionProps } from 'react-toolbox/lib/dialog';

import { Query } from '../../models/query';
import { AreaPageState } from '../../store/areaPage/reducer';
import { constructImageWithSrc } from '../../utils/constructImageWithSrc';
import { normalizeNumber } from '../../utils/normalizeNumber';

import './Area.css';

import trueCat from './cats/true.png';
import falseCat from './cats/false.png';
import chooseCat from './cats/choose.png';
import chairTexture from './textures/chair.jpg';
import floorTexture from './textures/floor.jpg';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CANVAS_STEPS_X = 7;
const CANVAS_STEPS_Y = 7;
const CANVAS_STEP_X = CANVAS_WIDTH / 2 / CANVAS_STEPS_X;
const CANVAS_STEP_Y = CANVAS_HEIGHT / 2 / CANVAS_STEPS_Y;

const CANVAS_COLOR_PRIMARY = '#090909';
const CANVAS_COLOR_SECONDARY = '#C0C0C0';
const CANVAS_COLOR_BACKGROUND = '#F9F9F9';
const CANVAS_COLOR_SHADOW = 'rgba(0, 0, 0, 0.5)';
const CANVAS_COLOR_AREA = '#007AD9';
// const CANVAS_COLOR_POINT_OTHER = '#333333';
// const CANVAS_COLOR_POINT_INCLUDES = '#00ff00';
// const CANVAS_COLOR_POINT_NOT_INCLUDES = '#ff0000';

const TRUE_CAT_IMAGE = constructImageWithSrc(trueCat);
const FALSE_CAT_IMAGE = constructImageWithSrc(falseCat);
const CHOOSE_CAT_IMAGE = constructImageWithSrc(chooseCat);
const CHAIR_TEXTURE_IMAGE = constructImageWithSrc(chairTexture);
const FLOOR_TEXTURE_IMAGE = constructImageWithSrc(floorTexture);

export interface AreaProps {

    locked: boolean;

    width?: number | string;
    height?: number | string;

    history: Query[];
    form: AreaPageState['form'];

    onSubmit(x: number, y: number): void;
}

interface AreaState {

    mouse?: {
        x: number;
        y: number;
        popupX: number;
        popupY: number;
    };

    undefinedRDialog: boolean;
}

export class Area extends React.Component<AreaProps, AreaState> {

    static defaultProps = { width: 400, height: 400 };

    private readonly canvas = React.createRef<HTMLCanvasElement>();

    private canvasScale = 1;
    private canvasTranslate = { x: 0, y: 0 };

    private onUndefinedRDialogHide = () => this.setState({ ...this.state, undefinedRDialog: false });
    private okDialogAction: DialogActionProps = { label: 'Ок', onClick: this.onUndefinedRDialogHide };

    state: AreaState = { undefinedRDialog: false };

    public repaint() {
        const { form, history } = this.props;

        const canvas = this.canvas.current;
        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d')!;

        const actualCanvasSize = {
            width: parseInt(getCurrentStyle(canvas, 'width'), 10),
            height: parseInt(getCurrentStyle(canvas, 'height'), 10)
        };

        // Init canvas
        context.globalAlpha = 1;
        context.resetTransform();
        context.clearRect(0, 0, canvas.width, canvas.height);

        const canvasScale = this.canvasScale = Math.min(
            actualCanvasSize.width / CANVAS_WIDTH,
            actualCanvasSize.height / CANVAS_HEIGHT
        );

        context.scale(canvasScale, canvasScale);

        const canvasTranslate = this.canvasTranslate = {
            x: (actualCanvasSize.width / canvasScale - CANVAS_WIDTH) / 2,
            y: (actualCanvasSize.height / canvasScale - CANVAS_HEIGHT) / 2
        };

        context.translate(canvasTranslate.x, canvasTranslate.y);

        context.strokeStyle = CANVAS_COLOR_PRIMARY;
        context.fillStyle = CANVAS_COLOR_BACKGROUND;
        context.font = `bold ${CANVAS_STEP_X / 2}px 'Courier New', monospace`;
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Clip
        context.beginPath();
        context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.clip();

        // Area
        const renderArea = (R: number, stroke: boolean = false) => {
            const halfR = R / 2;

            context.beginPath();
            context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * R, CANVAS_HEIGHT / 2);
            context.arcTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * R, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * R,
                CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * R,
                Math.abs((CANVAS_STEP_X + CANVAS_STEP_Y) / 2 * R));
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * R, CANVAS_HEIGHT / 2);
            context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * R, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * halfR);
            context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * halfR);
            context.closePath();

            if (stroke) {
                context.strokeStyle = CANVAS_COLOR_AREA;

                context.stroke();

                context.strokeStyle = CANVAS_COLOR_PRIMARY;
            } else {
                context.save();

                context.clip();
                for (let x = 0; x < CANVAS_STEPS_X * 2; ++x) {
                    for (let y = 0; y < CANVAS_STEPS_Y * 2; ++y) {
                        context.drawImage(CHAIR_TEXTURE_IMAGE, x * CANVAS_STEP_X,
                            y * CANVAS_STEP_Y, CANVAS_STEP_X, CANVAS_STEP_Y);
                    }
                }

                context.restore();

                context.strokeStyle = CANVAS_COLOR_SECONDARY;

                context.stroke();

                context.strokeStyle = CANVAS_COLOR_PRIMARY;
            }
        };

        // Specified area
        if (form.r !== undefined) {
            for (let x = 0; x < CANVAS_STEPS_X * 2; ++x) {
                for (let y = 0; y < CANVAS_STEPS_Y * 2; ++y) {
                    context.drawImage(FLOOR_TEXTURE_IMAGE, x * CANVAS_STEP_X,
                        y * CANVAS_STEP_Y, CANVAS_STEP_X, CANVAS_STEP_Y);
                }
            }

            renderArea(form.r);
        }

        // Grid
        context.strokeStyle = CANVAS_COLOR_SECONDARY;

        context.beginPath();
        for (let x = 1; x < CANVAS_STEPS_X * 2; ++x) {
            context.moveTo(x * CANVAS_STEP_X,CANVAS_STEP_Y / 4);
            context.lineTo(x * CANVAS_STEP_X, CANVAS_HEIGHT - CANVAS_STEP_Y / 4);
        }

        for (let y = 1; y < CANVAS_STEPS_Y * 2; ++y) {
            context.moveTo(CANVAS_STEP_X / 4, y * CANVAS_STEP_Y);
            context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 4, y * CANVAS_STEP_Y);
        }
        context.stroke();
        context.strokeStyle = CANVAS_COLOR_PRIMARY;

        // Axises
        context.lineWidth = 2;

        context.beginPath();
        context.moveTo(CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.moveTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y / 4);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X / 2, CANVAS_HEIGHT / 2);
        context.lineTo(CANVAS_WIDTH - CANVAS_STEP_X, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y / 4);

        context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_X / 2);
        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.lineTo(CANVAS_WIDTH / 2, CANVAS_STEP_Y / 2);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X / 4, CANVAS_STEP_Y);
        context.stroke();

        context.lineWidth = 1;

        // Abstract area
        if (form.r === undefined) {
            context.lineWidth = 2;

            renderArea(6, true);

            context.lineWidth = 1;
        }

        // Points
        const drawPoint = (x: number, y: number, image: HTMLImageElement) => {
            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;

            const zoom = 1.5 * Math.min(
                CANVAS_STEP_X / imageWidth,
                CANVAS_STEP_Y / imageHeight
            );

            const renderedWidth = zoom * imageWidth;
            const renderedHeight = zoom * imageHeight;

            context.drawImage(
                image,
                centerX + x * CANVAS_STEP_X - renderedWidth / 2,
                centerY - y * CANVAS_STEP_Y - renderedHeight / 2,
                renderedWidth,
                renderedHeight
            );

            // context.fillStyle = r !== undefined && point.r !== r
            //     ? CANVAS_COLOR_POINT_OTHER
            //     : point.result
            //         ? CANVAS_COLOR_POINT_INCLUDES
            //         : CANVAS_COLOR_POINT_NOT_INCLUDES
            // ;

            // context.beginPath();
            // context.arc(
            //     centerX + +point.x * CANVAS_STEP_X,
            //     centerY - +point.y * CANVAS_STEP_Y,
            //     3, 0, Math.PI * 2
            // );
            // context.fill();

            // context.lineWidth = 0.5;
            // context.stroke();
            // context.lineWidth = 1;
        };

        // History
        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;
        history.forEach((point) => {
            if (form.r !== undefined) {
                // context.globalAlpha = 1 - Math.min(point.r !== r ? Math.abs(+r - +point.r) / 3 : 0, 0.9);
                context.globalAlpha = point.r === form.r ? 1 : 0.2;
            }

            drawPoint(point.x, point.y, point.result ? TRUE_CAT_IMAGE : FALSE_CAT_IMAGE);
        });

        context.globalAlpha = 1;
        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        // Form point
        if (form.x !== undefined && form.y !== undefined) {
            drawPoint(form.x, form.y, CHOOSE_CAT_IMAGE);
        }

        // Shadow
        context.fillStyle = CANVAS_COLOR_SHADOW;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(CANVAS_WIDTH, 0);
        context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        context.lineTo(0, CANVAS_HEIGHT);
        context.closePath();

        context.moveTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 5, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 5);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 5, CANVAS_HEIGHT / 2 - CANVAS_STEP_Y * 5);
        context.lineTo(CANVAS_WIDTH / 2 + CANVAS_STEP_X * 5, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 3);
        context.lineTo(CANVAS_WIDTH / 2 - CANVAS_STEP_X * 5, CANVAS_HEIGHT / 2 + CANVAS_STEP_Y * 3);
        context.closePath();

        context.fill('evenodd');

        context.fillStyle = CANVAS_COLOR_BACKGROUND;

        drawPoint(centerX, centerY, CHOOSE_CAT_IMAGE);
    }

    // public drawChooseCat(a: any, b: any) {
    //     const canvas = this.canvas.current;
    //     if (!canvas) {
    //         return;
    //     }
    //     const context = canvas.getContext('2d')!;
    //     context.drawImage(CHOOSE_CAT_IMAGE, a-25, b-20, 50, 60);
    // }

    componentDidMount(): void {
        this.repaint();
    }

    componentDidUpdate(
        prevProps: Readonly<AreaProps>,
        prevState: Readonly<AreaState>,
        snapshot?: any
    ): void {
        this.repaint();
    }

    private onClick = () => {
        const { form, locked, onSubmit } = this.props;
        const { mouse } = this.state;

        if (locked) {
            return;
        }

        if (form.r === undefined) {
            this.setState({ ...this.state, undefinedRDialog: true });
            return;
        }

        if (mouse) {
            onSubmit(mouse.x, mouse.y);
        }
    };

    private onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvasE = event.currentTarget;
        if (!canvasE) {
            return;
        }

        const offsetLeft = parseInt(getCurrentStyle(canvasE, 'border-left-width'), 10);
        const offsetTop = parseInt(getCurrentStyle(canvasE, 'border-top-width'), 10);

        const rect = canvasE.getBoundingClientRect();
        const x = Math.ceil(event.clientX - rect.left - offsetLeft) / this.canvasScale - this.canvasTranslate.x;
        const y = Math.ceil(event.clientY - rect.top - offsetTop) / this.canvasScale - this.canvasTranslate.y;

        if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
            return;
        }

        const centerX = CANVAS_WIDTH / 2;
        const centerY = CANVAS_HEIGHT / 2;

        const zoomX = CANVAS_WIDTH / CANVAS_STEPS_X / 2;
        const zoomY = CANVAS_HEIGHT / CANVAS_STEPS_Y / 2;

        this.setState({
            ...this.state,

            mouse: {
                x: (x - centerX) / zoomX,
                y: (centerY - y) / zoomY,
                popupX: event.clientX,
                popupY: document.documentElement.clientHeight - event.clientY
            }
        });
        // setTimeout(() => this.drawChooseCat(x, y), 0);
    };

    private onMouseLeave = () => this.setState({ ...this.state, mouse: undefined });

    render() {
        const { width, height } = this.props;
        const { mouse, undefinedRDialog } = this.state;

        return (
            <div className="area">
                <canvas ref={this.canvas} className="area-canvas" width={width} height={height} onClick={this.onClick}
                        onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave} />

                <div className="area-mouse-position" style={{
                    left: (mouse?.popupX ?? 0) + 'px',
                    bottom: (mouse?.popupY ?? 0) + 'px',
                    display: mouse ? 'inherit' : 'none'
                }}>

                    <div className="area-mouse-position-bubble shadow-container">
                        {/*<div className="area-mouse-position-cat" />*/}

                        <div className="area-mouse-position-content">
                            X: {normalizeNumber(mouse?.x ?? 0)}

                            <br />

                            Y: {normalizeNumber(mouse?.y ?? 0)}
                        </div>
                    </div>
                </div>

                <Dialog title="Ошибка" actions={[this.okDialogAction]} onOverlayClick={this.onUndefinedRDialogHide}
                        onEscKeyDown={this.onUndefinedRDialogHide} active={undefinedRDialog}>
                    <p>
                        Параметр R не определён.<br />
                        Для интерактивной работы с изображением введите корректное значение R в форму рядом.
                    </p>
                </Dialog>
            </div>
        );
    }
}

function getCurrentStyle(element: HTMLElement, style: string) {
    try {
        return window.getComputedStyle(element, null).getPropertyValue(style);
    } catch (e) {
        return (element as { currentStyle?: { [key: string]: string } }).currentStyle![style];
    }
}
