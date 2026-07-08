import React from 'react';
import { Paginator, type PaginatorPageChangeEvent, type PaginatorProps } from 'primereact/paginator';
import './data.css';

type AppPaginatorProps = Omit<PaginatorProps, 'onPageChange'> & {
  onPageChange?: (event: PaginatorPageChangeEvent) => void;
};

const AppPaginator: React.FC<AppPaginatorProps> = ({
  className = '',
  onPageChange,
  ...props
}) => {
  return (
    <Paginator
      {...props}
      onPageChange={onPageChange}
      className={`app-paginator ${className}`.trim()}
    />
  );
};

export default AppPaginator;
