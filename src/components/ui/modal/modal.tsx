import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, dataTestId = 'ingredient-modal' }) => (
    <>
      <div className={styles.modal} data-testid={dataTestId}>
        <div className={styles.header}>
          <h3
            className={`${styles.title} text text_type_main-large`}
            data-testid="modal-title"
          >
            {title}
          </h3>
          <button
            className={styles.button}
            type="button"
            onClick={onClose}
            data-testid="modal-close-button"
          >
            <CloseIcon type="primary" onClick={onClose} />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <ModalOverlayUI
        onClick={onClose}
        data-testid="ingredient-modal-overlay"
      />
    </>
  )
);
