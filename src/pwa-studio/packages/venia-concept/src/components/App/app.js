import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { array, bool, func, shape, string } from 'prop-types';

import Main from '../Main';
import Mask from '../Mask';
import MiniCart from '../MiniCart';
import Navigation from '../Navigation';
import renderRoutes from './renderRoutes';
import errorRecord from '../../util/createErrorRecord';
import ToastContainer from '../ToastContainer';
import Icon from '../Icon';

import { getToastId, useToasts } from '@magento/peregrine';

import {
    AlertCircle as AlertCircleIcon,
    CloudOff as CloudOffIcon,
    Wifi as WifiIcon
} from 'react-feather';

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const ERROR_MESSAGE = 'Sorry! An unexpected error occurred.';
const dismissers = new WeakMap();

// Memoize dismisser funcs to reduce re-renders from func identity change.
const getErrorDismisser = (error, onDismissError) => {
    return dismissers.has(error)
        ? dismissers.get(error)
        : dismissers.set(error, () => onDismissError(error)).get(error);
};

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const [{ toasts }, { addToast }] = useToasts();

    const reload = useCallback(
        process.env.NODE_ENV === 'development'
            ? () => {
                  console.log(
                      'Default window.location.reload() error handler not running in developer mode.'
                  );
              }
            : () => {
                  window.location.reload();
              },
        []
    );

    const renderErrors = useMemo(
        () =>
            renderError
                ? [errorRecord(renderError, window, App, renderError.stack)]
                : [],
        [renderError]
    );

    const errors = renderError ? renderErrors : unhandledErrors;
    const handleDismiss = renderError ? reload : markErrorHandled;

    // Only add toasts for errors if the errors list changes. Since `addToast`
    // and `toasts` changes each render we cannot add it as an effect dependency
    // otherwise we infinitely loop.
    useEffect(() => {
        for (const { error, id, loc } of errors) {
            const errorToastProps = {
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    getErrorDismisser(error, handleDismiss)();
                    remove();
                },
                timeout: 15000,
                type: 'error'
            };
            // Only add a toast for new errors. Without this condition we would
            // re-add toasts when one error is removed even if there were two
            // added at the same time.
            const errorToastId = getToastId(errorToastProps);
            if (!toasts.get(errorToastId)) {
                addToast(errorToastProps);
            }
        }
    }, [errors, handleDismiss]); // eslint-disable-line

    const { app, closeDrawer } = props;
    const { drawer, hasBeenOffline, isOnline, overlay } = app;
    const navIsOpen = drawer === 'nav';
    const cartIsOpen = drawer === 'cart';

    useEffect(() => {
        if (hasBeenOffline) {
            if (isOnline) {
                addToast({
                    type: 'info',
                    icon: OnlineIcon,
                    message: 'You are online.',
                    timeout: 3000
                });
            } else {
                addToast({
                    type: 'error',
                    icon: OfflineIcon,
                    message:
                        'You are offline. Some features may be unavailable.',
                    timeout: 3000
                });
            }
        }
    }, [addToast, hasBeenOffline, isOnline]);

    if (renderError) {
        return (
            <Fragment>
                <Main isMasked={true} />
                <Mask isActive={true} />
                <ToastContainer />
            </Fragment>
        );
    }

    return (
        <Fragment>
            <Main
                isMasked={overlay}
                hasBeenOffline={hasBeenOffline}
                isOnline={isOnline}
            >
                {renderRoutes()}
            </Main>
            <Mask isActive={overlay} dismiss={closeDrawer} />
            <Navigation isOpen={navIsOpen} />
            <MiniCart isOpen={cartIsOpen} />
            <ToastContainer />
        </Fragment>
    );
};

App.propTypes = {
    app: shape({
        drawer: string,
        hasBeenOffline: bool,
        isOnline: bool,
        overlay: bool.isRequired
    }).isRequired,
    closeDrawer: func.isRequired,
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

export default App;
