import request from "request";

export const fetchData = (url: string, config: {}) => {
    return new Promise((resolve, reject) => {
        request(
            {
                url,
                ...config
            },
            (error: Error, response: any, body: any) => {
                if (error) return reject({ exception: 'ERROR', error: error });

                if (!response || response.statusCode !== 200)
                    return reject({ exception: 'ERROR', error: body });

                const contentType = response.caseless.get('Content-Type');

                if(contentType && contentType.indexOf('json') >= 0) {
                    return resolve(JSON.parse(body));
                }

                return resolve(body);
            }
        );
    });
};
