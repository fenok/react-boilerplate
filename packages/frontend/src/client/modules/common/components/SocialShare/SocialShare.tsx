import * as React from 'react';
import styled from 'styled-components';
import { useReactRouter } from '../../lib/routes';
import {
    FbShareQuery,
    fbUrl,
    OkShareQuery,
    okUrl,
    TwShareQuery,
    twUrl,
    VkShareQuery,
    vkUrl,
} from '../../lib/social-share-urls';
import { CommonProps } from '../../types/CommonProps';
import { Button } from '../Button';

interface Props extends CommonProps {
    url?: string;
    title?: string;
    image?: string;
    vk?: VkShareQuery;
    ok?: OkShareQuery;
    tw?: TwShareQuery;
    fb?: FbShareQuery;
}

const SocialShare: React.FC<Props> = ({ className, url, title, image, vk, ok, tw, fb }) => {
    const { location } = useReactRouter();

    const urlOrDefaultUrl = url || `${global.CANONICAL_ROBOTS_HOST}${global.BASENAME}${location.pathname}`;

    return (
        <Root className={className}>
            <SocialButton
                to={vkUrl({
                    url: (vk && vk.url) || urlOrDefaultUrl,
                    title: (vk && vk.title) || title,
                    image: (vk && vk.image) || image,
                    noparse: vk && vk.noparse,
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    no_vk_links: vk && vk.no_vk_links,
                })}
            >
                VK
            </SocialButton>
            <SocialButton
                to={okUrl({
                    url: (ok && ok.url) || urlOrDefaultUrl,
                    title: (ok && ok.title) || title,
                    imageUrl: (ok && ok.imageUrl) || image,
                })}
            >
                OK
            </SocialButton>
            <SocialButton
                to={twUrl({
                    url: (tw && tw.url) || urlOrDefaultUrl,
                    text: (tw && tw.text) || title,
                    hashtags: tw && tw.hashtags,
                    via: tw && tw.via,
                })}
            >
                TW
            </SocialButton>
            <SocialButton
                to={fbUrl({
                    u: (fb && fb.u) || urlOrDefaultUrl,
                })}
            >
                FB
            </SocialButton>
        </Root>
    );
};

const Root = styled.div``;

const SocialButton = styled(Button)`
    margin: 0 10px;

    :first-child {
        margin-left: 0;
    }

    :last-child {
        margin-right: 0;
    }
`;

export { SocialShare, Props };
