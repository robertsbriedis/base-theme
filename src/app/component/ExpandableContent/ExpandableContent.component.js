/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
import PropTypes from 'prop-types';
import { createRef, PureComponent } from 'react';

import TextPlaceholder from 'Component/TextPlaceholder';
import { ChildrenType, MixType } from 'Type/Common';

import './ExpandableContent.style';
/** @namespace Component/ExpandableContent/Component */
export class ExpandableContent extends PureComponent {
    static propTypes = {
        isContentExpanded: PropTypes.bool,
        heading: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        subHeading: PropTypes.string,
        children: ChildrenType.isRequired,
        mix: MixType.isRequired,
        onClick: (props, propName, componentName) => {
            const propValue = props[propName];
            if (propValue === null) {
                return;
            }
            if (typeof propValue === 'function') {
                return;
            }
            throw new Error(`${componentName} only accepts null or string`);
        },
        isContentExpandableOnDesktop: PropTypes.bool
    };

    static defaultProps = {
        subHeading: '',
        heading: '',
        isContentExpanded: false,
        onClick: null,
        isContentExpandableOnDesktop: false
    };

    expandableContentRef = createRef();

    __construct(props) {
        super.__construct(props);
        const { isContentExpanded } = this.props;
        this.state = {
            isContentExpanded,
            // eslint-disable-next-line react/no-unused-state
            prevIsContentExpanded: isContentExpanded
        };
    }

    static getDerivedStateFromProps({ isContentExpanded }, { prevIsContentExpanded }) {
        if (isContentExpanded !== prevIsContentExpanded) {
            return {
                prevIsContentExpanded: isContentExpanded,
                isContentExpanded
            };
        }

        return null;
    }

    scrollToExpandedContent(coveringElementsIds) {
        const { isContentExpanded } = this.state;
        const elem = this.expandableContentRef && this.expandableContentRef.current;
        if (isContentExpanded && !elem) {
            return;
        }
        const elemToWindowTopDist = elem.getBoundingClientRect().top;
        const windowToPageTopDist = document.body.getBoundingClientRect().top;
        const topToElemDistance = elemToWindowTopDist - windowToPageTopDist;
        const coveringElementsHeight = coveringElementsIds.reduce(
            (acc, elementId) => {
                const coveringElement = document.getElementById(elementId);

                if (!coveringElement) {
                    return acc;
                }

                return acc + coveringElement.offsetHeight;
            },
            0
        );
        const scrollTo = topToElemDistance - (screen.height - coveringElementsHeight - elem.offsetHeight);
        // checking if button is in a view-port
        if (-windowToPageTopDist >= scrollTo) {
            return;
        }
        window.scrollTo(0, scrollTo);
    }

    toggleExpand = () => {
        const { onClick } = this.props;
        if (onClick) {
            onClick();
            return;
        }
        this.setState(
            ({ isContentExpanded }) => ({ isContentExpanded: !isContentExpanded }),
            () => this.scrollToExpandedContent(['NavigationTabs', 'ProductActionsWrapper', 'CartPageSummary'])
        );
    };

    renderButton() {
        const { isContentExpandableOnDesktop } = this.props;
        const { isContentExpanded } = this.state;
        const {
            heading,
            subHeading,
            mix
        } = this.props;

        const modsButton = { isContentExpanded, isContentExpandableOnDesktop };
        const modsHeading = { isContentExpandableOnDesktop };

        return (
            <button
              block="ExpandableContent"
              elem="Button"
              mods={ modsButton }
              mix={ { ...mix, elem: 'ExpandableContentButton' } }
              onClick={ this.toggleExpand }
            >
                <span
                  block="ExpandableContent"
                  elem="Heading"
                  mods={ modsHeading }
                  mix={ { ...mix, elem: 'ExpandableContentHeading' } }
                >
                    { typeof heading === 'string' ? (
                        <TextPlaceholder content={ heading } length="medium" />
                    ) : (
                        heading
                    ) }
                </span>
                <span
                  block="ExpandableContent"
                  elem="SubHeading"
                  mix={ { ...mix, elem: 'ExpandableContentSubHeading' } }
                >
                    { subHeading }
                </span>
            </button>
        );
    }

    renderContent() {
        const { children, mix, isContentExpandableOnDesktop } = this.props;
        const { isContentExpanded } = this.state;

        const mods = { isContentExpanded, isContentExpandableOnDesktop };

        return (
            <div
              block="ExpandableContent"
              elem="Content"
              mods={ mods }
              ref={ this.expandableContentRef }
              mix={ { ...mix, elem: 'ExpandableContentContent', mods } }
            >
                { children }
            </div>
        );
    }

    render() {
        const { mix } = this.props;
        return (
            <article
              block="ExpandableContent"
              mix={ mix }
            >
                { this.renderButton() }
                { this.renderContent() }
            </article>
        );
    }
}
export default ExpandableContent;
