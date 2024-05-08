// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from "cross-fetch";

const getUserChanDetails = async () => {
    let hmacValue;
    let obj = { list: [] };

    try {
        const responseHmac = await fetch("https://tplayapi.code-crafters.app/321codecrafters/hmac.json");
        const data = await responseHmac.json();
        hmacValue = data.data.hmac.hdtl.value;
    } catch (error) {
        console.error('Error fetching and rearranging HMAC data:', error);
        return obj;
    }

    try {
        const responseChannels = await fetch("https://tplayapi.code-crafters.app/321codecrafters/fetcher.json");
        const cData = await responseChannels.json();

        if (cData && cData.data && Array.isArray(cData.data.channels)) {
            const flatChannels = cData.data.channels.flat();
            flatChannels.forEach(channel => {
                let firstGenre = channel.genres && channel.genres.length > 0 ? channel.genres[0] : null;
                let rearrangedChannel = {
                    id: channel.id,
                    name: channel.name,
                    tvg_id: channel.tvg_id,
                    group_title: firstGenre,
                    tvg_logo: channel.logo_url,
                    stream_url: channel.manifest_url,
                    license_url: channel.license_url,
                    stream_headers: channel.manifest_headers ? (channel.manifest_headers['User-Agent'] || JSON.stringify(channel.manifest_headers)) : null,
                    drm: channel.drm,
                    is_mpd: channel.is_mpd,
                    kid_in_mpd: channel.kid_in_mpd,
                    hmac_required: channel.hmac_required,
                    key_extracted: channel.key_extracted,
                    pssh: channel.pssh,
                    clearkey: channel.clearkeys ? JSON.stringify(channel.clearkeys[0].base64) : null,
                    hma: hmacValue
                };
                obj.list.push(rearrangedChannel);
            });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return obj;
    }

    return obj;
};

const generateM3u = async (ud) => {
    let m3uStr = '';

    let userChanDetails = await getUserChanDetails();
    let chansList = userChanDetails.list;

    m3uStr = '#EXTM3U x-tvg-url="https://raw.githubusercontent.com/mitthu786/tvepg/main/tataplay/epg.xml.gz"\n\n';

  for (let i = 0; i < chansList.length; i++) {
    m3uStr += '#EXTINF:-1 tvg-id="' + chansList[i].id.toString() + '" ';
    m3uStr += 'group-title="' + (chansList[i].group_title) + '", tvg-logo="https://mediaready.videoready.tv/tatasky-epg/image/fetch/f_auto,fl_lossy,q_auto,h_250,w_250/' + (chansList[i].tvg_logo) + '", ' + chansList[i].name + '\n';
    m3uStr += '#KODIPROP:inputstream.adaptive.license_type=clearkey\n';
    m3uStr += '#KODIPROP:inputstream.adaptive.license_key=' + chansList[i].clearkey + '\n';
    m3uStr += '#EXTVLCOPT:http-user-agent=' + chansList[i].stream_headers + '\n';
    m3uStr += '#EXTHTTP:{"cookie":"' + chansList[i].hma + '"}\n';
    m3uStr += chansList[i].stream_url + '\n\n';
}

m3uStr += '#EXTINF:-1  group-logo="https://od.lk/s/OV8yMTQ5MzMzMzRf/vt%20.PNG"  tvg-logo="https://od.lk/s/OV8yMTQ5MzMzMzRf/vt%20.PNG" group-title="𝙏𝙀𝙇𝙀𝙂𝙍𝘼𝙈 𝘾𝙃𝘼𝙉𝙉𝙀𝙇 | @𝙫𝙖𝙖𝙩𝙝𝙖𝙡𝙖1" group-logo="",𝙅𝙤𝙞𝙣 @𝙫𝙖𝙖𝙩𝙝𝙖𝙡𝙖1\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/KcpbPSGG/star-sprts-tamil-e1496057710686-416x234-modified.png" group-title="IPL  M1 | Cricket/Live" group-logo="",Star Sports 1 HD TAMIL 
https://c2ag.short.gy/index_vaathala.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL  M1 | Cricket/Live" group-logo="",TAMIL (jio)
https://c2ag.short.gy/tamil.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL  M1 | Cricket/Live" group-logo="",TELUGU (jio)
https://c2ag.short.gy/telugu.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL  M1 | Cricket/Live" group-logo="",ENGLISH (jio)
https://c2ag.short.gy/english.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL  M1 | Cricket/Live" group-logo="",HINDI (jio)
https://c2ag.short.gy/hindi.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL  M1 | Cricket/Live" group-logo="",KANNADA (jio)
https://c2ag.short.gy/kannada.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",INSIDERS (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/82d7c37dc9ba4ad3ab7966194bee1385/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",HANGOUT (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/b03529f8c0154d29ac5a225d78c6d65a/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",HERO (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/5a74ceb567cd49e6ba8b1ebf2fdfec69/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",BATTER (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/d7648a7014b34333a4074a6efafcb19f/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",STUMP (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/b789111ea8854f8db2dc545541484f27/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",BIRD EYE (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/a491dee5aa0f4e29a197ef1c043a1084/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL  M1 | Cricket/Live" group-logo="",SPLIT (Multi Cam)
https://prod-ent-live-gm.jiocinema.com/out/v1/1893486ccd08469e82b3fab606921c26/master.m3u8\n';


m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/KcpbPSGG/star-sprts-tamil-e1496057710686-416x234-modified.png" group-title="IPL M2 | Cricket/Live" group-logo="",Star Sports 1 HD TAMIL 
https://c2ag.short.gy/index_vaathala.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL M2 | Cricket/Live" group-logo="",TAMIL (jio)
https://prod-ent-live-gm.jiocinema.com/out/v1/d47167b7fed042699cf27c943b02c906/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL M2 | Cricket/Live" group-logo="",TELUGU (jio)
https://prod-ent-live-gm.jiocinema.com/out/v1/30842203799f41fd813b6cc00c0aee0f/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL M2 | Cricket/Live" group-logo="",ENGLISH (jio)
https://prod-ent-live-gm.jiocinema.com/out/v1/5d292fddf5a24561ba3b6aab20bd5679/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL M2 | Cricket/Live" group-logo="",HINDI (jio)
https://prod-ent-live-gm.jiocinema.com/out/v1/175d164d6001491aacbb1d22c3c2bfbe/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://i.postimg.cc/pT9Y5tP2/1080x720-1564282-tata-ipl.jpg" group-title="IPL M2 | Cricket/Live" group-logo="",KANNADA (jio)
https://prod-ent-live-gm.jiocinema.com/out/v1/af483cfae36d4dfc991cc46e0088477e/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL M2 | Cricket/Live" group-logo="",INSIDERS (Multi Cam)
https://prod-sports-cohort-fa.jiocinema.com/hls/live/2109926/uhd_akamai_atv_avc_insider_ipl_s2_m2280424/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL M2 | Cricket/Live" group-logo="",HANGOUT (Multi Cam)
https://prod-sports-cohort-fa.jiocinema.com/hls/live/2109944/uhd_akamai_atv_avc_lifestyle_ipl_s2_m2280424/master.m3u8\n';

m3uStr += '#EXTINF:-1 tvg-logo="https://substack-post-media.s3.amazonaws.com/public/images/f5e1e25a-ff00-4345-bb91-4c235617154b_1200x609.jpeg" group-title="IPL M2 | Cricket/Live" group-logo="",SPLIT (Multi Cam)
https://prod-sports-multiangle.jiocinema.com/hls/live/2109556/hd_akamai_iosmob_avc_cam05_ipl_s2_m2280424/master.m3u8\n';

    console.log('all done!');
    return m3uStr;
};

export default async function handler(req, res) {
    let uData = {
        tsActive: true
    };

    if (uData.tsActive) {
        let m3uString = await generateM3u(uData);
        res.status(200).send(m3uString);
    }
}
