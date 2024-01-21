import React from 'react';
import {Box, Card, CardContent} from "@mui/material";
import {Title} from "@mui/icons-material";


function HelpPage() {
    return (
        <div style={{overflowY:"scroll",height:"90vh"}}>
                <Box sx={{ maxWidth:500,marginX:'auto',marginTop:'20px' }}>
                <Card variant="outlined">

                    <CardContent>
                        <h3>ヘルプ</h3>
                        <p>
                            このサイトは開発中です。
                        </p>

                    </CardContent>

                </Card>
                </Box>
            <Box sx={{ maxWidth:500,marginX:'auto',marginTop:'20px' }}>
                <Card variant="outlined">

                    <CardContent>
                        <h3>WEBサイトのライセンス</h3>
                        <a href={"https://github.com/KameLong/Sujiro"}>https://github.com/KameLong/Sujiro</a>

                        <h3>その他外部ライセンス</h3>
                        <p>
                            DiaPro-Bold.ttf<br/>
                            DiaPro-Regular.ttf<br/>
                        </p>
                        <p>
                            SIL Open Font License 1.1<br/>
                            配布元URL：https://but.tw/font/<br/>
                            時刻表っぽいフォント — DiaPro<br/>
                        </p>
                        <a href={"/font/font-license"}>フォントのライセンス</a>

                        <p>
                            <a href={"/npm-license.html"}>依存ライブラリのライセンス</a>
                            </p>


                    </CardContent>

                </Card>
            </Box>
        </div>


    );
}

export default HelpPage;


