import React from 'react';
import { Button } from 'react-toolbox/lib/button';

import { UpdateFormAction } from '../../store/areaPage/actions';
import { NumberField } from '../NumberField/NumberField';

import './AreaForm.css';

export interface AreaFormProps {

    locked: boolean;

    x?: number;
    y?: number;
    r?: number;

    onChange(property: UpdateFormAction['property'], value?: number | null): void;
    onSubmit(): void;
}

interface AreaFormState {

    x?: number | null;
    y?: number | null;
    r?: number | null;

    error: {
        x: boolean;
        y: boolean;
        r: boolean;
    }
}

export class AreaForm extends React.Component<AreaFormProps, AreaFormState> {

    private static errorMessages = {
        x: 'Параметр X должен быть числом и входить в интервал (-5, 5)',
        y: 'Параметр Y должен быть числом и входить в интервал (-3, 5)',
        r: 'Параметр R должен быть числом и входить в интервал (-5, 5)'
    };

    state: AreaFormState = { error: { x: false, y: false, r: false } };

    componentDidUpdate(
        prevProps: Readonly<AreaFormProps>,
        prevState: Readonly<AreaFormState>,
        snapshot?: any
    ): void {
        (['x', 'y', 'r'] as const).forEach(property => {
            if (
                this.state.error[property] !== (
                    this.props[property] === undefined && this.state[property] !== undefined
                )
            ) {
                this.setState({
                    ...this.state,

                    error: {
                        ...this.state.error,

                        [property]: !this.state.error[property]
                    }
                });
            }

            if (prevState[property] !== this.state[property]) {
                this.props.onChange(property, this.state[property]);
            }
        });
    }

    private onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        if (this.validateParameters()) {
            this.props.onSubmit();
        }

        event.preventDefault();
    };

    private validateParameters() {
        const { x, y, r } = this.props;

        return x !== undefined && y !== undefined && r !== undefined;
    }

    render() {
        const { locked } = this.props;
        const { x, y, r, error } = this.state;

        return (
            <div className="area-form">
                <form onSubmit={this.onSubmit}>
                    <NumberField label="Параметр X:" hint="(-5, 5)" value={x}
                                 error={error.x && AreaForm.errorMessages.x} disabled={locked}
                                 onChange={x => this.setState({ ...this.state, x })} />

                    <NumberField label="Параметр Y:" hint="(-3, 5)" value={y}
                                 error={error.y && AreaForm.errorMessages.y} disabled={locked}
                                 onChange={y => this.setState({ ...this.state, y })} />

                    <NumberField label="Параметр R:" hint="(-5, 5)" value={r}
                                 error={error.r && AreaForm.errorMessages.r} disabled={locked}
                                 onChange={r => this.setState({ ...this.state, r })} />

                    <Button type="submit" label="Проверить" raised primary
                            disabled={locked || !this.validateParameters()} />
                </form>
            </div>
        );
    }
}
