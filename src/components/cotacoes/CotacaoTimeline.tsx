import React from 'react';
import type { TimelineEvent } from '../../types/cotacao';
import { formatDateTime } from '../../utils/format';
import './cotacoes.css';

interface CotacaoTimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const CotacaoTimeline: React.FC<CotacaoTimelineProps> = ({ events, title }) => (
  <div className="cotacao-timeline">
    {title ? <h3 className="cotacao-timeline__title">{title}</h3> : null}
    <ul className="cotacao-timeline__list">
      {events.map((event, index) => (
        <li
          key={event.id}
          className={`cotacao-timeline__item${event.concluido ? ' cotacao-timeline__item--done' : ''}${event.ativo ? ' cotacao-timeline__item--active' : ''}`}
        >
          <div className="cotacao-timeline__marker">
            {event.concluido ? <i className="pi pi-check" /> : <span>{index + 1}</span>}
          </div>
          <div className="cotacao-timeline__content">
            <strong>{event.titulo}</strong>
            {event.descricao ? <p>{event.descricao}</p> : null}
            {event.concluido ? (
              <time className="cotacao-timeline__time">{formatDateTime(event.data)}</time>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default CotacaoTimeline;
