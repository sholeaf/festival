import github from '../assets/images/footer/github_logo.png';
import erdcloud from '../assets/images/footer/erdcloud_logo.png';
import figma from '../assets/images/footer/figma_logo.png';
import notion from '../assets/images/footer/notion_logo.png';
import spring from '../assets/images/footer/spring_logo.png';
import vsc from '../assets/images/footer/vs_logo.png';
import react from '../assets/images/footer/react_logo.png';
import main from '../assets/images/footer/main_logo.png';

const Footer = () => {
    return (<>
        <footer>
            <div class="footer_area">
                <div class="footer_rayout">
                    <div class="footer_logo">
                        <img src={main} alt="" />
                        <div>
                            © Copyright Everyone's_Festival
                        </div>
                    </div>

                    <div id="footerft" class="footer_box">
                        <div class="team_info">
                            <div>
                                <div>강한얼</div>
                                <a href="https://github.com/Gilmani90" target="_blank">https://github.com/Gilmani90</a>
                            </div>
                            <div>
                                <div>김영민</div>
                                <a href="https://github.com/enjoymin" target="_blank">https://github.com/enjoymin</a>
                            </div>
                            <div>
                                <div>배규진</div>
                                <a href="https://github.com/bgj5593" target="_blank">https://github.com/bgj5593</a>
                            </div>
                            <div>
                                <div>장수호</div>
                                <a href="https://github.com/sholeaf" target="_blank">https://github.com/sholeaf</a>
                            </div>
                        </div>

                        <div class="tool_info">
                            <div class="toolbox">
                                <img src={github} alt="" />
                                <div>GitHub</div>
                            </div>

                            <div class="toolbox">
                                <img src={notion} alt="" />
                                <div>Notion</div>
                            </div>

                            <div class="toolbox">
                                <img src={figma} alt="" />
                                <div>Figma</div>
                            </div>

                            <div class="toolbox">
                                <img src={erdcloud} alt="" id="erd_round" />
                                <div>ERD CLOUD</div>
                            </div>

                            <div class="toolbox">
                                <img src={vsc} alt="" />
                                <div>Visual Studio Code</div>
                            </div>

                            <div class="toolbox">
                                <img src={spring} alt="" />
                                <div>Spring Tool Suite4</div>
                            </div>
                            <div class="toolbox">
                                <img src={react} alt="" />
                                <div>React</div>
                            </div>

                            <div class="ppt">
                                <a href="https://www.canva.com/design/DAGVqDlgTBw/K4WldxHBrfRPFM1VLZ9tOw/edit?ui=eyJEIjp7IlAiOnsiQiI6ZmFsc2V9fX0" target="_blank">
                                    <div>development</div>
                                    <div>proposal</div>
                                </a>
                            </div>

                            <div class="Team_Notion">
                                <div>Team Notion</div>
                                <a href="https://www.notion.so/135a916fc38f8015b81ecbce4f1bf688"
                                    target="_blank">Click !</a>
                            </div>

                        </div>
                    </div>

                </div>


            </div>
        </footer>
    </>
    );
}
export default Footer;