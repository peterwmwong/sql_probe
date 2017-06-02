import '../../css/flex.css';
import './Breakdown.css';
import React, { Component } from 'react';
import Chart from 'chart.js';

const round = num => ((num * 100.0) | 0) / 100.0;

export default class Breakdown extends Component {
  constructor() {
    super();
    this.mountCanvas = this.mountCanvas.bind(this);
    this.state = { data: [] };
  }

  onHover = (e, [target]) => {
    this.props.onHover(target && this.state.data[target._index])
  }

  updateData({ items, reducer }) {
    const { chart } = this;
    const data = reducer(items);
    this.setState({ data });

    if (chart) {
      const colors = data.map(d => d.color);
      chart.data.labels = data.map(d => d.label);
      chart.data.datasets[0].data = data.map(d => round(d.value));

      Object.assign(chart.data.datasets[0], {
        data: data.map(d => d.value),
        backgroundColor: colors,
        hoverBackgroundColor: colors
      });
      chart.update();
    }
  }

  componentWillReceiveProps(props) {
    const { items, reducer } = this.props;
    if(
      props.items && props.reducer
        && (items !== props.items || reducer !== props.reducer)
    ) {
      this.updateData(props);
    }
  }

  mountCanvas(canvas) {
    this.canvas = canvas;
    if (canvas) {
      this.chart = new Chart(canvas, {
        type: 'pie',
        options: {
          ...(this.props.onHover && {
            hover: {
              onHover: this.onHover,
              mode: 'index'
            }
          }),
          legend: { display: false },
        },
        data: {
          labels: [],
          datasets: [ { data: [] } ]
        }
      });
      this.updateData(this.props);
    }
  }

  render() {
    const { state: { data }, props: { unit } } = this;
    return (
      <div className='Breakdown'>
        <div className='Breakdown-graphContainer'>
          <canvas ref={this.mountCanvas}/>
        </div>
        <div className='Breakdown-table'>
          {data.map(({ label, color, value }, i) =>
            <div className='Breakdown-item' key={i}>
              <div className='Breakdown-value'>
                {round(value)} {unit}
              </div>
              <div className='Breakdown-box' style={{color}} />
              <div className='Breakdown-label'>
                {label}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}