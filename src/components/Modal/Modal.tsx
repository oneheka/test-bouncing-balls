import { Component } from "react";
import { checkColor, Colors } from "../../util/Ball/Ball";
import styles from './Modal.module.css';

export default class Modal extends Component<{ show: boolean, close: () => any, setColor: (color: string) => any }> {
    render() {
        if(!this.props.show) return ''

        return <div className={styles.modal} onClick={this.props.close.bind(this)}>
            <div className={styles.block}>
                <p>Выберите цвет</p>
                <div className={styles.colors}>
                    {
                    Colors.map(
                        (c) => (
                            <div
                            key={c}
                            className={styles.circle}
                            style={{ background: checkColor(c) }}
                            onClick={this.props.setColor.bind(this, c)}
                            ></div>
                        )
                    )
                    }
                </div>
            </div>
        </div>
    }
}