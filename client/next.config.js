module.exports = {
    async redirects(){
      return[
        {
          source: '/',
          destination: '/login',
          permanent: true,
        }
      ]
    },
    images: {
      domains: ['scontent-ort2-1.cdninstagram.com', 'instagram.fccu3-1.fna.fbcdn.net'],
    },
}